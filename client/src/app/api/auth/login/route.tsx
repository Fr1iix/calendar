// src/app/api/auth/login/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        console.log('Данные для входа:', { email });

        const response = await axios.post('http://localhost:6000/api/user/login', {
            email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Логируем полный ответ для проверки
        console.log('Ответ сервера при входе:', response.data);

        return NextResponse.json({
            token: response.data.token,
            user: response.data.user, // Убедитесь, что возвращаете данные пользователя
            message: 'Вход выполнен успешно'
        }, { status: 200 });

    } catch (error: any) {
        console.error('Полная ошибка входа:', error);

        if (axios.isAxiosError(error)) {
            console.error('Ответ сервера:', error.response?.data);
            console.error('Статус:', error.response?.status);

            return NextResponse.json({
                message: error.response?.data?.message || 'Ошибка входа',
                details: error.response?.data
            }, { status: error.response?.status || 500 });
        }

        return NextResponse.json({
            message: 'Внутренняя ошибка сервера',
            details: error.message
        }, { status: 500 });
    }
}