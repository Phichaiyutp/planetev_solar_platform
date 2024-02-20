import React from "react";

interface CardProps {
  title: string;
  value: string;
  unit: string;
  second_value?: string;
  second_unit?: string;
  text?: string;
  second_text?: string;
  bg? :string;
}

const Card: React.FC<CardProps> = ({ title, value, unit, second_value, second_unit, text, second_text ,bg }) => {
  return (
    <div className={`card ${bg !== undefined ? bg : 'bg-base-100'} shadow-lg lg:h-full lg:max-h-60`}>
      <div className="card-body flex flex-col justify-between">
        <div className={`${bg !== undefined ? 'text-white' : ''}`}>
          <h2 className={"card-title inline-block align-text-top text-sm lg:text-lg"}>{title}</h2>
          <p className={`mx-1 mb-1 xl:mx-1 xl:mb-1 2xl:mx-10 2xl:mb-2 ${text} ${second_value !== undefined ? 'mt-4':'my-12'} ${second_value !== undefined ? 'mt-4':'my-12'}`}>{value}</p>
          <div className="card-actions justify-end">
            <h2 className="card-title xl:text-sm">{unit}</h2>
          </div>
        </div>
        {second_value !== undefined && (
          <div>
            <p className={`mx-1 mb-1 xl:mx-1 xl:mb-1 2xl:mx-10 2xl:mb-2 ${second_text} `}>{second_value}</p>
            <div className="card-actions justify-end">
              <h2 className="mb-2  xl:mb-1 card-title xl:text-sm">{second_unit}</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
