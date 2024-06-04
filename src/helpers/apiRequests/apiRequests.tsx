import { BASE_URL } from "../../constants";
import { HttpMethodEnum } from "../../enums";
import { ITruck } from "../../interfaces";

type RequestBody = BodyInit | null | undefined;

interface RequestOptions {
  method: HttpMethodEnum;
  body?: HttpMethodEnum extends "GET" | "DELETE" ? undefined : RequestBody;
  queryParams?: Record<string, string> | URLSearchParams;
}

export async function fetchData<T>(
  url: string,
  options: RequestOptions,
): Promise<T> {
  const requestOptions: RequestInit = {
    method: options.method,
    headers: { "Content-Type": "application/json" },
    body: options.body ? options.body : undefined,
  };

  let urlWithParams = url;
  if (options.queryParams) {
    const params = new URLSearchParams(options.queryParams);
    urlWithParams = `${url}?${params.toString()}`;
  }

  const response: Response = await fetch(urlWithParams, requestOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  try {
    return await processResponse<T>(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getInitialTrucks(pageSize: number) {
  let result: ITruck[] = [];
  let pageIndex = 1;
  const pagesToFetch = 4;

  while (pageIndex <= pagesToFetch) {
    const data: ITruck[] = await fetchData<ITruck[]>(
      `${BASE_URL}/trucks?page=${pageIndex}&limit=${pageSize}`,
      {
        method: HttpMethodEnum.GET,
        queryParams: { page: String(pageIndex), limit: String(pageSize) },
      },
    );
    result = result.concat(data);
    if (data.length < pageSize) {
      break;
    }
    pageIndex += 1;
  }
  return result;
}

export function getTrucks(
  queryParams?: Record<string, string>,
): Promise<ITruck[]> {
  return fetchData<ITruck[]>(`${BASE_URL}/trucks`, {
    method: HttpMethodEnum.GET,
    queryParams,
  });
}

export async function putTruck(id: number, data: string): Promise<ITruck[]> {
  return await fetchData<ITruck[]>(`${BASE_URL}/trucks/${id}`, {
    method: HttpMethodEnum.PUT,
    body: data,
  });
}

export async function postTruck(data: string): Promise<ITruck> {
  return await fetchData<ITruck>(`${BASE_URL}/trucks`, {
    method: HttpMethodEnum.POST,
    body: data,
  });
}

export function deleteTruck(id: number): Promise<void> {
  return fetchData<void>(`${BASE_URL}/trucks/${id}`, {
    method: HttpMethodEnum.DELETE,
  });
}

async function readStreamToText(
  stream: ReadableStream<Uint8Array>,
): Promise<string> {
  const reader = stream.getReader();
  let chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const textDecoder = new TextDecoder();
  const combinedChunks = new Uint8Array(
    chunks.reduce((acc, chunk) => acc + chunk.length, 0),
  );

  let offset = 0;
  for (const chunk of chunks) {
    combinedChunks.set(chunk, offset);
    offset += chunk.length;
  }

  return textDecoder.decode(combinedChunks);
}

async function processResponse<T>(response: Response): Promise<T> {
  const text = await readStreamToText(response.body as ReadableStream);
  try {
    const parsedResponse = JSON.parse(text);
    return parsedResponse as T;
  } catch (error) {
    throw new Error("Error parsing response JSON");
  }
}
