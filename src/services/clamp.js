export default (min, max) => (value) => Math.max(min, Math.min(value, max))