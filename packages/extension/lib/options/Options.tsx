import React from 'react';

interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => {
  return <div className="_ibe-text-lg">{title.toUpperCase()} PAGE</div>;
};

export default Options;
