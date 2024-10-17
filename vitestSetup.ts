import { beforeAll, vi } from "vitest";

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => null;
  vi.mock("next/navigation", () => ({
    _esModule: true,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      isFallback: false,
    }),
  }));
});
