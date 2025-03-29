interface StructuredDataProps {
  data: Record<string, any>;
}

const StructuredData = ({ data }: StructuredDataProps) => {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
};

export default StructuredData;
