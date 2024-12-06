import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Box
} from '@mui/material';
import { AccountCircle, MailOutline, Badge, SupervisedUserCircle } from '@mui/icons-material';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

const initialUsers: User[] = [
    { id: 1, name: 'Иван Иванов', email: 'ivanov@example.com', role: 'пользователь' },
    { id: 2, name: 'Петр Петров', email: 'petrov@example.com', role: 'организатор' },
    // Добавьте больше пользователей здесь
];

const UsersTable = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);

    const handleRoleChange = (id: number, newRole: string) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id ? { ...user, role: newRole } : user
            )
        );
    };

    return (
        <TableContainer component={Paper} style={{ maxWidth: '100%', margin: 'auto', marginTop: '20px' }}>
            <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="users table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '10%' }}>
                                <Badge fontSize="small" style={{ marginRight: 8 }}/> Айди
                            </TableCell>
                            <TableCell sx={{ width: '30%' }}>
                                <AccountCircle fontSize="small" style={{ marginRight: 8 }}/> ФИО
                            </TableCell>
                            <TableCell sx={{ width: '30%' }}>
                                <MailOutline fontSize="small" style={{ marginRight: 8 }}/> Почта
                            </TableCell>
                            <TableCell sx={{ width: '30%' }}>
                                <SupervisedUserCircle fontSize="small" style={{ marginRight: 8 }}/> Роль
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.id}
                                sx={{
                                    height: 64,
                                    '& > *': { verticalAlign: 'middle' },
                                }}
                            >
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            minWidth: 150,
                                            height: 40,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as string)}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            sx={{
                                                fontSize: 14,
                                                height: '40px',
                                                lineHeight: '1.5',
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                    },
                                                },
                                                disableScrollLock: true,
                                            }}
                                        >
                                            <MenuItem value="пользователь">Пользователь</MenuItem>
                                            <MenuItem value="организатор">Организатор</MenuItem>
                                            <MenuItem value="администратор">Администратор</MenuItem>
                                        </Select>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </TableContainer>
    );
};

export default UsersTable;
