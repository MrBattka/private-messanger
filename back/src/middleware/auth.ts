import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Типизация данных из токена
interface JwtPayload {
  userId: number;
  username: string;
}

// Расширяем тип Request, чтобы можно было писать req.user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware для проверки JWT токена
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Ищем токен в заголовке Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация. Токен отсутствует.' });
  }

  // Проверяем подпись токена
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      // Если ошибка верификации (истёк, поддельный и т.д.)
      return res.status(403).json({ error: 'Недействительный или просроченный токен.' });
    }

    // Сохраняем данные пользователя в запросе
    req.user = user as JwtPayload;
    next(); // разрешаем следующему обработчику выполниться
  });
};