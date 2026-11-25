import "@testing-library/jest-dom";

// Polyfill IntersectionObserver for Framer Motion viewport animations in jsdom
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = MockIntersectionObserver;
