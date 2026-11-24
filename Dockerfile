FROM node:24-bookworm-slim AS build
WORKDIR /src
COPY app/catalog.mjs app/catalog.mjs
COPY scripts/package.mjs scripts/package.mjs
RUN node scripts/package.mjs

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
COPY --from=build --chown=node:node /src/dist/catalog.mjs ./catalog.mjs
USER node
EXPOSE 8080
CMD ["node", "catalog.mjs"]
