export default function TrendSign({ spendingTrend, large }) {
  if (spendingTrend === 0) {
    return null;
  }

  if (spendingTrend < 0) {
    return (
      <svg width={large ? '15' : '10'}
           height={large ? '15' : '10'}
           viewBox='0 0 15 15' fill='none'
           xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M3.64645 3.64644C3.45118 3.8417 3.45118 4.15828 3.64645 4.35354L10.2929 11L6 11C5.72386 11 5.5 11.2239 5.5 11.5C5.5 11.7761 5.72386 12 6 12L11.5 12C11.6326 12 11.7598 11.9473 11.8536 11.8536C11.9473 11.7598 12 11.6326 12 11.5L12 5.99999C12 5.72385 11.7761 5.49999 11.5 5.49999C11.2239 5.49999 11 5.72385 11 5.99999V10.2929L4.35355 3.64643C4.15829 3.45117 3.84171 3.45117 3.64645 3.64644Z'
          fill='currentColor'
          fillRule='evenodd'
          clipRule='evenodd'>

        </path>
      </svg>
    );
  }

  return (
    <svg width={large ? '15' : '10'}
         height={large ? '15' : '10'}
         viewBox='0 0 15 15'
         fill='none'
         xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'>
      </path>
    </svg>
  );
}
