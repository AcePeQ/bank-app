export async function testPromise() {
  try {
    console.log("Pending...")
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("done")
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

