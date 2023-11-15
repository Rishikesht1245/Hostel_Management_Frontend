//extending the global window object to include a property named Razorpay

// custom global type
declare global {
  interface Window {
    Razorpay: any;
  }
}

export {};
