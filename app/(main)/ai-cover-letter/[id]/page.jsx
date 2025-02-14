const CoverLetter = async ({ params }) => {
  const id = await params.id;
  return <div>Cover Letter: {id}</div>;
};

export default CoverLetter;
