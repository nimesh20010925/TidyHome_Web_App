
import Consumption from "./consumption_home"; 

const ParentComponent = () => {
  const imageUrl = "https://placehold.co/600x400/png"; 

  return (
    <div>
      <Consumption image={imageUrl} /> 
    </div>
  );
};

export default ParentComponent;