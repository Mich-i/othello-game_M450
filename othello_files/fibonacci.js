export function fibonacci(n) {
  if (typeof n == "number" && n >= 0) {
    switch (n) {
      case 0:
      case 1:
        return 1;
      default:
        return fibonacci(n - 2) + fibonacci(n - 1);
    }
  }
}