import type { PublicInstitutionSettings } from "../../../../settings/settingsApi";
import type { Theme } from "../../../../theme/themeApi";
import TextLengthToggler from "../../../../../components/ui/textLengthToggler";

interface InstitutionalHeaderProps {
  settings: PublicInstitutionSettings;
  themes: Theme[];
}

const InstitutionalHeader = ({
  settings,
  themes,
}: InstitutionalHeaderProps) => {
  const { institution, branding, contact, leadershipMessages } = settings;

  // PRINCIPAL'S MESSAGE
  const principalMessage = leadershipMessages?.leaders?.find(
    (leader: { role?: string; isActive?: boolean }) =>
      leader?.role === "PRINCIPAL" && leader?.isActive,
  );

  // THEME CONFIGURATION
  const theme = themes.find((theme) => theme?.slug === "modern-professional");

  const colors = theme?.config?.colors;
  const layout = theme?.config?.layout;

  // THEME COLORS
  const primaryColor = colors?.primary || branding?.primaryColor || "#123B83";

  const secondaryColor = colors?.secondary || "#0D9488";
  const backgroundColor = colors?.background || "#F8FAFC";
  const surfaceColor = colors?.surface || "#FFFFFF";
  const textColor = colors?.text || "#1E293B";
  const mutedColor = colors?.muted || "#64748B";

  const gradient = `linear-gradient(125deg, ${primaryColor}, ${secondaryColor})`;

  return (
    <section
      className="mx-auto px-4 py-8 sm:px-6 lg:px-0 lg:py-14"
      style={{
        maxWidth: layout?.maxWidth || "1280px",
        color: textColor,
      }}
    >
      {/* =====================================================
          1. INSTITUTIONAL IDENTITY
      ===================================================== */}

      <div
        className="relative overflow-hidden rounded-3xl p-6 shadow-xl sm:p-10 lg:p-8"
        style={{ background: gradient }}
      >
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />

        <div className="absolute -bottom-32 -right-5 h-80 w-80 rounded-full border border-white/10" />

        <div className="relative z-10 flex flex-col items-center gap-7 text-center md:flex-row md:text-left">
          {/* INSTITUTION LOGO */}
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-4 border-white/80 bg-white p-2 shadow-lg sm:h-40 sm:w-40">
            {branding?.logo ? (
              <img
                src={branding.logo}
                alt={institution?.name || "Institution logo"}
                className="h-full w-full rounded-full object-contain"
              />
            ) : (
              <span
                className="text-5xl font-extrabold"
                style={{ color: primaryColor }}
              >
                {institution?.name?.charAt(0) || "E"}
              </span>
            )}
          </div>

          {/* INSTITUTION NAME */}
          <div className="min-w-0 flex-1 text-white">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-white/75">
              {institution?.institutionType || "Educational Institution"}
            </p>

            <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl lg:text-5xl">
              {institution?.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-white/90 md:justify-start">
              {institution?.establishedYear && (
                <span className="flex items-center gap-2">
                  <span>✦</span>
                  Established {institution.establishedYear}
                </span>
              )}

              {contact?.address && (
                <span className="flex items-center gap-2">
                  <span>⌖</span>
                  {contact.address}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          2. INSTITUTION INFORMATION
      ===================================================== */}

      <div
        className="mt-6 grid grid-cols-1 gap-5 rounded-2xl border p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3 lg:p-7"
        style={{
          backgroundColor: surfaceColor,
          borderColor: `${mutedColor}30`,
        }}
      >
        {/* EMAIL */}
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
            }}
          >
            ✉
          </div>

          <div className="min-w-0">
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: mutedColor }}
            >
              Email Address
            </p>

            <p className="mt-2 break-all font-semibold">
              {institution?.email || "Not provided"}
            </p>
          </div>
        </div>

        {/* PHONE */}
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
            style={{
              backgroundColor: `${secondaryColor}15`,
              color: secondaryColor,
            }}
          >
            ☎
          </div>

          <div className="min-w-0">
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: mutedColor }}
            >
              Contact Number
            </p>

            <p className="mt-2 font-semibold">
              {institution?.phone || "Not provided"}
            </p>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
            }}
          >
            ⌖
          </div>

          <div className="min-w-0">
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: mutedColor }}
            >
              Institution Address
            </p>

            <p className="mt-2 font-semibold leading-relaxed">
              {contact?.address || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          3. PRINCIPAL'S MESSAGE
      ===================================================== */}

      {principalMessage && (
        <div
          className="mt-8 grid overflow-hidden rounded-3xl border shadow-sm lg:grid-cols-[280px_1fr]"
          style={{
            backgroundColor: surfaceColor,
            borderColor: `${mutedColor}30`,
          }}
        >
          {/* PRINCIPAL PROFILE */}
          <div
            className="flex flex-col items-center justify-center p-7 text-center"
            style={{ backgroundColor }}
          >
            {/* PRINCIPAL PHOTO */}
            <div
              className="h-36 w-36 overflow-hidden rounded-full border-4 border-white p-1 shadow-lg"
              style={{ background: gradient }}
            >
              {principalMessage.photo ? (
                <img
                  src={principalMessage.photo}
                  alt={principalMessage.name || "Principal"}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center rounded-full bg-white text-4xl font-bold"
                  style={{ color: primaryColor }}
                >
                  {principalMessage.name?.charAt(0) || "P"}
                </div>
              )}
            </div>

            {/* PRINCIPAL NAME */}
            <h2 className="mt-5 text-xl font-bold">{principalMessage.name}</h2>

            <p
              className="mt-2 text-sm font-bold"
              style={{ color: primaryColor }}
            >
              {principalMessage.designation || "Principal"}
            </p>

            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: mutedColor }}
            >
              {principalMessage.qualification}
            </p>
          </div>

          {/* PRINCIPAL MESSAGE CONTENT */}
          <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-11">
            <div className="mb-5 flex items-center gap-3">
              <div
                className="h-1 w-10 rounded-full"
                style={{ backgroundColor: secondaryColor }}
              />

              <p
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: secondaryColor }}
              >
                Message from the Principal
              </p>
            </div>

            <div
              className="text-base leading-8 sm:text-lg"
              style={{ color: textColor }}
            >
              <TextLengthToggler text={principalMessage.message} limit={220} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InstitutionalHeader;

// import type { PublicInstitutionSettings } from "../../../../settings/settingsApi";
// import type { Theme } from "../../../../theme/themeApi";
// import TextLengthToggler from "../../../../../components/ui/textLengthToggler";

// interface InstitutionalHeaderProps {
//   settings: PublicInstitutionSettings;
//   themes: Theme[];
// }

// const InstitutionalHeader = ({
//   settings,
//   themes,
// }: InstitutionalHeaderProps) => {
//   const { institution, branding, contact, social, leadershipMessages } =
//     settings;

//   const principalMessage = leadershipMessages?.leaders?.find(
//     (leader: { role?: string; isActive?: boolean }) =>
//       leader?.role === "PRINCIPAL" && leader?.isActive,
//   );

//   const theme = themes.find((theme) => theme?.slug === "modern-professional");

//   const colors = theme?.config?.colors;
//   const layout = theme?.config?.layout;

//   const primaryColor = colors?.primary || branding?.primaryColor || "#123B83";

//   const secondaryColor = colors?.secondary || "#0D9488";
//   const backgroundColor = colors?.background || "#F8FAFC";
//   const surfaceColor = colors?.surface || "#FFFFFF";
//   const textColor = colors?.text || "#1E293B";
//   const mutedColor = colors?.muted || "#64748B";

//   return (
//     <section
//       className="mx-auto lg:px-0 px-4 py-8 sm:px-6 lg:py-14"
//       style={{
//         maxWidth: layout?.maxWidth || "1280px",
//         color: textColor,
//       }}
//     >
//       {/* INSTITUTIONAL IDENTITY */}
//       <div
//         className="relative overflow-hidden rounded-3xl p-6 shadow-xl sm:p-10 lg:p-4 lg:py-6"
//         style={{
//           background: `linear-gradient(125deg, ${primaryColor}, ${secondaryColor})`,
//         }}
//       >
//         <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
//         <div className="absolute -bottom-32 -right-5 h-80 w-80 rounded-full border border-white/10" />

//         <div className="relative z-10 flex flex-col items-center gap-7 text-center md:flex-row md:text-left">
//           {/* LOGO */}
//           <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-4s border-white/80 bg-white p-2 shadow-lg sm:h-40 sm:w-40">
//             {branding?.logo ? (
//               <img
//                 src={branding.logo}
//                 alt={institution?.name || "Institution logo"}
//                 className="h-full w-full rounded-full object-contain"
//                 style={{
//                   // backgroundColor: `${primaryColor}15`,
//                   background: `linear-gradient(125deg, ${primaryColor}, ${secondaryColor})`,
//                   color: primaryColor,
//                 }}
//               />
//             ) : (
//               <span
//                 className="text-4xl font-bold"
//                 style={{ color: primaryColor }}
//               >
//                 {institution?.name?.charAt(0) || "E"}
//               </span>
//             )}
//           </div>

//           {/* NAME AND TAGLINE */}
//           <div className="min-w-0 flex-1 text-white">
//             <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-white/75">
//               {institution?.institutionType || "Educational Institution"}
//             </p>

//             <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl lg:text-5xl">
//               {institution?.name}
//             </h1>

//             <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/90 md:justify-start">
//               {institution?.establishedYear && (
//                 <span className="flex items-center gap-2">
//                   <span>✦</span>
//                   Established {institution.establishedYear}
//                 </span>
//               )}

//               {contact?.address && (
//                 <span className="flex items-center gap-2">
//                   <span>⌖</span>
//                   {contact.address}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* INSTITUTION INFORMATION */}
//       <div
//         className="mt-6 grid grid-cols-1 gap-4 rounded-2xl borders p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3 lg:p-7"
//         style={{
//           background: `linear-gradient(125deg, ${primaryColor}, ${secondaryColor})`,
//           // backgroundColor: surfaceColor,
//           borderColor: `${mutedColor}25`,
//         }}
//       >
//         <div className="flex items-start gap-4">
//           <div
//             className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl text-white"
//             style={{
//               background: `linear-gradient(125deg, ${primaryColor}, ${secondaryColor})`,
//               // backgroundColor: `${primaryColor}15`,
//               // color: primaryColor,
//             }}
//           >
//             ✉
//           </div>
//           <div className="min-w-0">
//             <p
//               className="text-xs font-semibold uppercase tracking-wider text-white"
//               // style={{ color: mutedColor }}
//             >
//               Email Address
//             </p>
//             <p className="mt-1 break-all font-semibold text-white">
//               {institution?.email || "Not provided"}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-start gap-4">
//           <div
//             className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl text-white"
//             style={{
//               // backgroundColor: `${secondaryColor}15`,
//               background: `linear-gradient(125deg, ${primaryColor}, ${secondaryColor})`,
//               // color: secondaryColor,
//             }}
//           >
//             ☎
//           </div>
//           <div className="min-w-0">
//             <p
//               className="text-xs font-semibold uppercase tracking-wider text-white"
//               // style={{ color: mutedColor }}
//             >
//               Contact Number
//             </p>
//             <p className="mt-1 font-semibold text-white">
//               {institution?.phone || "Not provided"}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-start gap-4">
//           <div
//             className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-5xl text-white"
//             style={{
//               // backgroundColor: `${primaryColor}15`,
//               background: `linear-gradient(125deg, ${primaryColor}, ${secondaryColor})`,
//               // color: primaryColor,
//             }}
//           >
//             ⌖
//           </div>
//           <div className="min-w-0">
//             <p
//               className="text-xs font-semibold uppercase tracking-wider text-white"
//               // style={{ color: mutedColor }}
//             >
//               Institution Address
//             </p>
//             <p className="mt-1 font-semibold text-white">
//               {contact?.address || "Not provided"}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* PRINCIPAL'S MESSAGE */}
//       {principalMessage && (
//         <div
//           className="mt-8 grid overflow-hidden rounded-3xl borders shadow-sm lg:grid-cols-[280px_1fr]"
//           style={{
//             // backgroundColor: surfaceColor,
//             background: `linear-gradient(125deg, ${primaryColor}, ${secondaryColor})`,
//             borderColor: `${mutedColor}25`,
//           }}
//         >
//           {/* PRINCIPAL PROFILE */}
//           <div
//             className="flex flex-col items-center justify-center p-7 text-center"
//             // style={{ backgroundColor: backgroundColor }}
//           >
//             {principalMessage.photo ? (
//               <img
//                 src={principalMessage.photo}
//                 alt={principalMessage.name || "Principal"}
//                 className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-lg p-1.5"
//                 style={{
//                   // backgroundColor: `${primaryColor}15`,
//                   background: `linear-gradient(125deg, ${primaryColor}, ${secondaryColor})`,
//                   color: primaryColor,
//                 }}
//               />
//             ) : (
//               <div
//                 className="flex h-32 w-32 items-center justify-center rounded-full text-4xl font-bold"
//                 style={{
//                   // backgroundColor: `${primaryColor}15`,
//                   background: `linear-gradient(125deg, ${primaryColor}, ${secondaryColor})`,
//                   color: primaryColor,
//                 }}
//               >
//                 {principalMessage.name?.charAt(0) || "P"}
//               </div>
//             )}

//             <h2 className="mt-5 text-xl font-bold text-white">
//               {principalMessage.name}
//             </h2>

//             <p
//               className="mt-1 text-sm font-semibold text-white"
//               // style={{ color: primaryColor }}
//             >
//               {principalMessage.designation || "Principal"}
//             </p>

//             <p
//               className="mt-2 text-sm text-white"
//               // style={{ color: mutedColor }}
//             >
//               {principalMessage.qualification}
//             </p>
//           </div>

//           {/* MESSAGE */}
//           <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-11">
//             <div className="mb-5 flex items-center gap-3">
//               <div
//                 className="h-1 w-10 rounded-full bg-white"
//                 // style={{ backgroundColor: secondaryColor }}
//               />
//               <p
//                 className="text-xs font-bold uppercase tracking-[0.2em] text-white"
//                 // style={{ color: secondaryColor }}
//               >
//                 Message from the Principal
//               </p>
//             </div>

//             <div
//               className="text-base leading-8 sm:text-lg text-white"
//               // style={{ color: textColor }}
//             >
//               <TextLengthToggler text={principalMessage.message} limit={220} />
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default InstitutionalHeader;
