setup:
	pnpm install
	docker compose up -d --wait
	pnpm prisma:migrate
	pnpm prisma:generate
dev:
	docker compose up -d --wait
	pnpm dev & pnpm start-ws
