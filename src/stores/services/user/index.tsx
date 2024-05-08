import type { LoginRequest, RegisterRequest } from './interfaces/Request';
import type { LoginResponse, RegisterResponse } from './interfaces/Response';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://10.0.2.2:3003/api/v1' }),
  reducerPath: 'userApi',
  tagTypes: ['User'],
  endpoints: builder => ({
    registerUser: builder.mutation<RegisterResponse, RegisterRequest>({
      query: body => ({
        url: '/user/register',
        method: 'POST',
        body,
      }),
    }),
    loginUser: builder.mutation<LoginResponse, LoginRequest>({
      query: body => ({
        url: '/user/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = userApi;
