-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "tech_stack" JSONB DEFAULT '[]',
    "demo_url" VARCHAR(500),
    "repo_url" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "position" VARCHAR(255) NOT NULL,
    "company" VARCHAR(255) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "is_published" BOOLEAN DEFAULT false,
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");
