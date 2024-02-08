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
          <h2 className="card-title ">{title}</h2>
          <div className="flex justify-around mx-10 sm:mx-1 xl:mx-1 mb-2">
            <div className="text-center w-[49%]">
              <div className="">
                <p className={`${text} my-6 xl:my-4`}>{value}</p>
                <p className="card-title justify-end xl:text-sm">{unit}</p>
              </div>
            </div>
            <div className="mx-2 bg-black w-[1%]"></div>
            <div className="text-center w-[49%]">
              <div className="">
                <p className={`${second_text} my-6 xl:my-4`}>{second_value}</p>
                <p className="card-title justify-end xl:text-sm">{second_unit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
