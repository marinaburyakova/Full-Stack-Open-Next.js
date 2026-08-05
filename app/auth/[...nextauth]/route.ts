// app/api/auth/[...nextauth]/route.ts
import { handlers } from "../../../auth";

// Вызываем методы GET и POST внутри стрелочных функций.
// Это защищает Turbopack от падения при сборке конфигурации страницы /login!
export const GET = (req: Request) => handlers.GET(req);
export const POST = (req: Request) => handlers.POST(req);
