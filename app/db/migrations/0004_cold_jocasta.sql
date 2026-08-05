CREATE TABLE "reading_list" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reading_list_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"blog_id" integer NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	"is_read" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "reading_list" ADD CONSTRAINT "reading_list_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_list" ADD CONSTRAINT "reading_list_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;