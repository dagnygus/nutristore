export function assertNotNull<T>(target: T): asserts target is Exclude<T, null | undefined> {
  if (target == null) {
    throw new Error('Null assetion failed');
  }
}
