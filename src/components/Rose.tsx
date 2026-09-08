import "../style/Rose.css";

const  Rose = ({ className = "" }) => {
  return (
    <svg
      className={`rose-svg ${className}`}
      viewBox="0 0 120 180"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem */}
      <path
        className="rose-stem"
        d="M60 175 C58 140 62 105 60 75"
      />

      {/* Left leaf */}
      <path
        className="rose-leaf"
        d="
          M59 125
          C42 120 25 126 18 143
          C35 146 51 141 59 125
          Z
        "
      />

      {/* Right leaf */}
      <path
        className="rose-leaf"
        d="
          M61 105
          C76 96 92 99 101 113
          C84 116 70 114 61 105
          Z
        "
      />

      {/* Outer petals */}
      <path
        className="rose-petal outer"
        d="
          M60 82
          C28 82 19 63 25 45
          C30 29 46 23 60 30
          C74 23 90 29 95 45
          C101 63 92 82 60 82
          Z
        "
      />

      {/* Middle petals */}
      <path
        className="rose-petal middle"
        d="
          M60 72
          C42 70 34 59 38 46
          C42 35 52 31 60 38
          C68 31 78 35 82 46
          C86 59 78 70 60 72
          Z
        "
      />

      {/* Inner petal */}
      <path
        className="rose-petal inner"
        d="
          M60 62
          C50 60 47 53 50 46
          C53 40 58 41 60 46
          C62 41 67 40 70 46
          C73 53 70 60 60 62
          Z
        "
      />

      {/* Center */}
      <circle
        className="rose-center"
        cx="60"
        cy="52"
        r="5"
      />
    </svg>
  );
}

export default Rose;