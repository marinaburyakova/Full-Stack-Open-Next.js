
import { handlers } from "@/auth";

export const GET = (req: Request) => handlers.GET(req);
export const POST = (req: Request) => handlers.POST(req);
