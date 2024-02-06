import React from "react";

interface CardProps {
  title: string;
  value: number;
  unit: string;
  second_value?: number;
  second_unit?: string;
  text?: string;
  second_text?: string;
}

const Card: React.FC<CardProps> = ({ title, value, unit, second_value, second_unit, text, second_text }) => {
  return (
    <div className="card bg-base-100 shadow-xl h-full max-h-60">
      <div className="card-body flex flex-col justify-between h-full">
        <div>
          <h2 className="card-title">{title}</h2>
          <p className={`mx-10 mb-2 ${text} ${second_value !== undefined ? 'mt-4':'my-12'} `}>{value}</p>
          <div className="card-actions justify-end">
            <h2 className="card-title">{unit}</h2>
          </div>
        </div>
        {second_value !== undefined && (
          <div>
            <p className={`mx-10 ${second_text}`}>{second_value}</p>
            <div className="card-actions justify-end">
              <h2 className="mb-2 card-title">{second_unit}</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
