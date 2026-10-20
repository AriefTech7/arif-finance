import '@testing-library/jest-dom/vitest'

/**
 * Node 26 menyediakan `localStorage` eksperimental yang membutuhkan
 * `--localstorage-file`. Di environment test kita pasang implementasi
 * in-memory sederhana supaya perilaku aplikasi konsisten.
 */
class MemoryStorage implements Storage {
  private store = new Map<string, string>()

  get length(): number {
    return this.store.size
  }

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value))
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
})

/**
 * jsdom belum mengimplementasikan canvas 2d. Chart.js membutuhkan context,
 * jadi kita sediakan stub ringan agar komponen chart bisa di-render di test.
 */
function createContextStub(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const base = {
    canvas,
    measureText: () => ({ width: 0, actualBoundingBoxAscent: 0, actualBoundingBoxDescent: 0 }),
    createLinearGradient: () => ({ addColorStop: () => undefined }),
    getImageData: () => ({ data: [] }),
  }

  return new Proxy(base as unknown as CanvasRenderingContext2D, {
    get(target, property) {
      if (property in target) return Reflect.get(target, property)
      return () => undefined
    },
    set(target, property, value) {
      Reflect.set(target, property, value)
      return true
    },
  })
}

HTMLCanvasElement.prototype.getContext = function getContext(this: HTMLCanvasElement) {
  return createContextStub(this)
} as unknown as HTMLCanvasElement['getContext']

/** jsdom tidak mengimplementasikan ResizeObserver (dipakai Chart.js). */
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver =
  globalThis.ResizeObserver ?? (ResizeObserverStub as unknown as typeof ResizeObserver)
