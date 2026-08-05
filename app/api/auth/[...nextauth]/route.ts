// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"; // Настройка import alias @/* ссылается на корень
export const { GET, POST } = handlers;
