# Architecture rules

- Bound smart-capture network waits with `withTimeout` and run optional geographic enrichment alongside image analysis so unavailable external services cannot freeze capture.
- Define shared React context objects outside provider/hook modules to preserve context identity during hot updates and prevent consumers from losing their provider.