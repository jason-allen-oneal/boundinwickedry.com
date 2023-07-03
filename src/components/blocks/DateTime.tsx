import { useEffect, useState } from "react";
import { getTime } from '@/lib/utils';
import { parseISO } from 'date-fns' 

type Props = {
  time: string;
  type: string;
};

const DateTime = ({ time, type }: Props) => {
  if(!time){
    return <></>;
  }
  const date = parseISO(time);
  
  return <time dateTime={time} suppressHydrationWarning>{getTime(type, date)}</time>;
};

export default DateTime;
