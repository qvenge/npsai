import { get, normalizeQuery } from '@/shared/api/request';
import { auth } from '@/auth';
import { type BaseReviewQuery } from './base-query';
import { normalizeReviewQuery } from './lib';
import z from 'zod';

export const ReviewListQuery = z.object({
  place_id: z.string(),
  period_from: z.string().optional(),
  period_to: z.string().optional(),
  order_by: z.string().optional(),
  descending: z.boolean().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
  review_type_filter: z.string().optional(),
  category_filter: z.string().optional()
});

// "id": 1,
// "ts": "2024-11-11T15:50:24.222867",
// "org": "test_org",
// "place": "test_place",
// "file": "./uploads/1731340214_enc.mp3",
// "rating": "negative",
// "user_rating": "positive",
// "emo": 0.0,
// "transcript": "Я в этом фудмаркете уже давно ем и меня, конечно, бесит прям вот несколько моментов. 1, это там громкая музыка, ты, если тебе позвонили, зум надо провести или там с клиентом поговорить. Все ты не можешь. Все знают, что ты в кафехе находишься цены, просто пипец в arcus вот там поесть до пуза, там 350 ₽ здесь за 30.\n50 ₽, ты там не знаю, даже шавуху не купишь. Там футбол уже под 700 ₽ стоит. Ну куда это годится, причём качество еды, там for Бо в том числе упало сильно. Ну не знаю такое себе.\n",
// "insight": "{\n    \"общая оценка\": \"негативная\",\n    \"похвала\": {},\n    \"критика\": {\n        \"атмосфера\": [\n            \"громкая музыка\"\n        ],\n        \"цена\": [\n            \"высокие цены\",\n            \"некачественная еда за высокую цену\"\n        ]\n    },\n    \"пожелания\": [],\n    \"состояние\": \"ok\"\n}",
// "categories": "критика:атмосфера|критика:цена|"

export interface ReviewItem {
  id: number;
  ts: string;
  org: string;
  place: string;
  file: string;
  rating: string;
  user_rating: string;
  emo: number;
  transcript: number;
  insight: string;
  categories: string;
}

export interface ReviewListResponse {
  result: ReviewItem[];
  page: number;
  size: number;
  total: number;
}

export interface GetReviewListQuery extends BaseReviewQuery {
  place_id: string;

  period_from?: string | null;
  period_to?: string | null;
  
  /**
   * Отсортировать по полю
   */
  order_by?: 'rating' | 'date';

  /**
   * Сортировка по убыванию
   */
  descending?: boolean;

  /**
   * Номер страницы
   */
  page?: number;

  /**
   * Размер страницы
   */
  size?: number;
}

export async function getReviewList(query: z.infer<typeof ReviewListQuery>): Promise<ReviewListResponse> {
  const session = await auth();

  const res = await get('/review/list', normalizeQuery(query), {
    accessToken: session?.access_token
  });

  if (res.status !== 200) {
    throw new Error(res.statusText);
  }

  const data = await res.json();

  return data as ReviewListResponse;
}

