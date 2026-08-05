CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"username" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"api_token" text,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "likes" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;