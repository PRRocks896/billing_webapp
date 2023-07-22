const PrintContent = ({ billData }) => {
  console.log("print content", billData);
  const contentToPrint = "<h1>Hello, this is the content to be printed!</h1>";

  return <div dangerouslySetInnerHTML={{ __html: contentToPrint }} />;
};

export default PrintContent;
