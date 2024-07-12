import React from "react";
import Image from 'next/image'

interface Value {
  valueName: string;
  value?: string;
  unit?: string;
  color?: string;
  icon?: string;
}

interface CardProps {
  title: string;
  data: Value[];
}

const Card = ({ title, data }: CardProps) => {
  return (
    <div className={`card w-full xl:w-max-[380px] 2xl:w-max-[450px]`}>
      <div className="card-body flex flex-col justify-between">
        <div>
          <h2 className="card-title inline-block align-text-top text-sm lg:text-lg 2xl:text-xl">{title}</h2>
          <div className="card h-fit mt-4 border text-sm 2xl:text-lg">
            {data.map((item, index) => (
              <div key={index} className="card-body py-2 flex flex-row justify-between items-center">
                <p className="font-bold align-middle">{item.valueName}</p>
                <div className="flex flex-row items-center "> 
                  <p
                    className={`px-4 text-sm lg:text-lg 2xl:text-xl font-bold
                    ${index === 0 ? 'text-success' : ''}
                    ${index === 1 ? 'text-primary' : ''}
                    ${item.color ? item.color : ''}`}
                  >
                    {item.value}
                  </p>
                  <p className="align-middle">{item.unit}</p> 
                  {item.icon && 
                    <Image
                      src={item.icon}
                      width={50}
                      height={50}
                      alt="Picture of the weather"
                    />
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;