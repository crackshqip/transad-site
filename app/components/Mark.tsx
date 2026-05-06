type Props = {
  size?: number;
  color?: string;
  title?: string;
};

export default function Mark({ size = 22, color = "#131313", title = "Transad" }: Props) {
  return (
    <svg
      width={size}
      height={size * 1.137}
      viewBox="0 0 46.344 52.668"
      fill={color}
      role="img"
      aria-label={title}
    >
      <path d="M 44.656 0 L 1.688 0 C 0.76 0 0 0.76 0 1.69 L 0 9.733 C 0 10.662 0.76 11.422 1.688 11.422 L 17.17 11.422 L 17.17 50.979 C 17.17 51.908 17.93 52.668 18.858 52.668 L 27.553 52.668 C 28.482 52.668 29.241 51.908 29.241 50.979 L 29.241 11.422 L 44.656 11.422 C 45.584 11.422 46.344 10.662 46.344 9.733 L 46.344 1.69 C 46.344 0.76 45.584 0 44.656 0 Z" />
    </svg>
  );
}
