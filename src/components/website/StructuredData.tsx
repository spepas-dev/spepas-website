interface StructuredDataProps {
  data: Record<string, unknown>;
}

const StructuredData = ({ data }: StructuredDataProps) => {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
};

export default StructuredData;
