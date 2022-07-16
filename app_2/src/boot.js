import _ from "lodash";
console.log(_.add(1, 2));

const main = async () => {
  const { sayHello } = await import("RemoteApp/utils");
  sayHello();


  const { default: Foo } = await import("RemoteApp/foo");
  console.info('🚀', Foo)
}

console.log("Hello");

main();