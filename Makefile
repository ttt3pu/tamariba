dev:
	docker compose up -d --wait
	pnpm dev & pnpm start-ws
