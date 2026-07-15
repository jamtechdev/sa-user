import PanaBulkScreen from './PanaBulkScreen';

type Props = {
  marketId: string;
  marketName: string;
  gameId: string;
  gameName: string;
};

/** Two Digit Pana = Double Pana (90 DP, 2 same digits). */
export default function TwoDigitPanaScreen(props: Props) {
  return (
    <PanaBulkScreen
      {...props}
      kind="double-pana"
      titleOverride="Two Digit Pana"
      subOverride="Double Pana · 90 · do digit same"
    />
  );
}
