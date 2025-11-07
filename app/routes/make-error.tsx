export async function loader() {
  makeError();
}

function makeError() {
  throw new Error('This is a test error');
}

export default function () {
  return <div> MakeError </div>;
}
