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
    Box,
    TextField,
    IconButton,
    Button,
} from '@mui/material';
import {
    AccountCircle,
    MailOutline,
    Badge,
    Search,
    AssignmentInd, // Для роли
} from '@mui/icons-material';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

const initialUsers: User[] = [
    { id: 1, name: 'Иван Иванов', email: 'ivanov@example.com', role: 'пользователь' },
    { id: 2, name: 'Петр Петров', email: 'petrov@example.com', role: 'организатор' },
    { id: 3, name: 'Сергей Сергеев', email: 'sergeev@example.com', role: 'пользователь' },
    { id: 4, name: 'Алексей Алексеев', email: 'alekseev@example.com', role: 'администратор' },
    { id: 5, name: 'Мария Мариева', email: 'marieva@example.com', role: 'пользователь' },
    { id: 6, name: 'Ольга Ольгина', email: 'olgina@example.com', role: 'организатор' },
    { id: 7, name: 'Дмитрий Дмитриев', email: 'dmitriev@example.com', role: 'пользователь' },
    { id: 8, name: 'Елена Еленина', email: 'elenina@example.com', role: 'администратор' },
    { id: 9, name: 'Николай Николаев', email: 'nikolaev@example.com', role: 'пользователь' },
];

const UsersTable = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;

    const handleRoleChange = (id: number, newRole: string) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id ? { ...user, role: newRole } : user
            )
        );
    };

    const filteredUsers = users.filter((user) =>
        (`${user.name} ${user.email}`.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

    return (
        <TableContainer
            component={Paper}
            sx={{
                maxWidth: '100%',
                margin: 'auto',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                    variant="outlined"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <IconButton>
                                <Search />
                            </IconButton>
                        ),
                    }}
                    sx={{ flex: 1 }}
                />
            </Box>
            <Table sx={{ minWidth: 650 }} aria-label="users table">
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Badge fontSize="small" />
                                ID
                            </Box>
                        </TableCell>
                        <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccountCircle fontSize="small" />
                                ФИО
                            </Box>
                        </TableCell>
                        <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MailOutline fontSize="small" />
                                Почта
                            </Box>
                        </TableCell>
                        <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AssignmentInd fontSize="small" />
                                Роль
                            </Box>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, alignItems: 'center' }}>
                <Button
                    variant="outlined"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Назад
                </Button>
                <Box>Страница {currentPage} из {totalPages}</Box>
                <Button
                    variant="outlined"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Вперед
                </Button>
            </Box>
        </TableContainer>
    );
};

export default UsersTable;