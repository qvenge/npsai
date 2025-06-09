'use server';

import { requestApi } from '@/shared/api';
import { auth } from '@/auth';

import { z } from 'zod/v4'

const Image = z.file();
 
const CreatePlaceFormSchema = z.object({
  pic_file: Image.nullable().optional(),
  name: z
    .string()
    .min(2, { message: 'Название должно быть не менее 2 символов' })
    .trim(),
  ptype: z
    .string()
    .min(1, { message: 'Укажите тип заведения' })
    .trim(),
  notification_recipient: z
    .string()
    .min(2, { message: 'Телеграм должно быть не менее 2 символов' })
    .trim(),
  notification_enable: z
    .boolean()
});

const EditPlaceFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Название должно быть не менее 2 символов' })
    .trim(),
  ptype: z
    .string()
    .min(1, { message: 'Укажите тип заведения' })
    .trim(),
  notification_recipient: z
    .string()
    .min(2, { message: 'Телеграм должно быть не менее 2 символов' })
    .trim(),
  notification_enable: z
    .boolean()
});
 
type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export async function addPlaceAction(state: FormState, formData: FormData) {
  const session = await auth();

  const validatedFields = CreatePlaceFormSchema.safeParse({
    pic_file: formData.get('pic_file'),
    name: formData.get('name'),
    ptype: formData.get('ptype'),
    notification_recipient: formData.get('notification_recipient'),
    notification_enable: formData.get('notification_enable') === 'on',
  });

  formData.set('notification_enable', String(formData.get('notification_enable') === 'on'));

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const res = await requestApi('/organization/create_place', {
    method: 'POST',
    body: formData,
    accessToken: session?.access_token
  });

  if (res.status < 200 || res.status >= 300) {
    throw new Error(res.statusText);
  }

  return {
    success: true
  }
}

export async function editPlaceAction(placeId: string | number, state: FormState, formData: FormData) {
  const session = await auth();
  const reqs = [];

  const validatedFields = EditPlaceFormSchema.safeParse({
    name: formData.get('name'),
    ptype: formData.get('ptype'),
    notification_recipient: formData.get('notification_recipient'),
    notification_enable: formData.get('notification_enable') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  if (formData.get('pic_file') != null) {
    const fileFormData = new FormData();
    fileFormData.append('pic_file', formData.get('pic_file') as File);
    fileFormData.append('place_id', placeId.toString());

    reqs.push(
      requestApi(`/organization/set_place_picture?place_id=${placeId}`, {
        method: 'PUT',
        body: fileFormData,
        accessToken: session?.access_token
      })
    );
  }

  reqs.push(
    requestApi(`/organization/update_place?place_id=${placeId}`, {
      method: 'POST',
      body: validatedFields.data,
      accessToken: session?.access_token
    })
  );

  const resps = await Promise.all(reqs);
  
  for (let resp of resps) {
    if (resp.status < 200 || resp.status >= 300) {
      throw new Error(resp.statusText);
    }
  }

  return {
    success: true
  }
}

export async function deletePlaceAction(id: string | number) {
  const session = await auth();

  const res = await requestApi(`/organization/delete_place?place_id=${id}`, {
    method: 'POST',
    accessToken: session?.access_token
  });

  if (res.status < 200 || res.status >= 300) {
    throw new Error(res.statusText);
  }

  return {
    success: true
  }
}