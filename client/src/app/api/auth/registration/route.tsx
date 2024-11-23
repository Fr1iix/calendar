import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    try {
        const {
            email,
            password,
            phone = '',
            firstName = '',
            lastName = '',
            middleName = '',
            role = 'user'
        } = await request.json();

        console.log('Данные для регистрации:', {
            email,
            phone,
            firstName,
            lastName,
            middleName,
            role
        });

        const response = await axios.post('http://localhost:6000/api/user/registration', {
            email,
            password,
            phone,
            firstName,
            lastName,
            middleName,
            role
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return NextResponse.json({
            token: response.data.token,
            message: 'Регистрация прошла успешно'
        }, { status: 200 });

    } catch (error: any) {
        console.error('Полная ошибка регистрации:', error);

        if (axios.isAxiosError(error)) {
            console.error('Ответ сервера:', error.response?.data);
            console.error('Статус:', error.response?.status);

            return NextResponse.json({
                message: error.response?.data?.message || 'Ошибка регистрации',
                details: error.response?.data
            }, { status: error.response?.status || 500 });
        }

        return NextResponse.json({
            message: 'Внутренняя ошибка сервера',
            details: error.message
        }, { status: 500 });
    }
}