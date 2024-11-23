import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
    // Получаем токен из заголовков
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({
            message: 'Токен не предоставлен'
        }, { status: 401 });
    }

    try {
        // Отправляем запрос на проверку токена на бэкенд
        const response = await axios.get('http://localhost:6000/api/user/auth', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json({
            user: response.data,
            message: 'Пользователь авторизован'
        }, { status: 200 });

    } catch (error: any) {
        console.error('Ошибка проверки авторизации:', error);

        if (error.response) {
            return NextResponse.json({
                message: error.response.data.message || 'Ошибка авторизации'
            }, { status: error.response.status });
        }

        return NextResponse.json({
            message: 'Внутренняя ошибка сервера'
        }, { status: 500 });
    }
}