// Long-form content for each treatment page.
// Fill in the fields per service. Any field left as an empty string / empty
// array will be hidden on the page — no need to delete sections you don't use.

export type ServiceFaq = { question: string; answer: string };

export type ServiceContent = {
  slug: string;              // must match SERVICES slug in src/lib/site.ts
  tagline: string;           // 1 short sentence under the H1
  overview: string;          // 1–3 paragraphs, plain prose
  howItWorks: string;        // 1–3 paragraphs
  benefits: string[];        // bullet points
  idealFor: string[];        // bullet points
  whatToExpect: string;      // 1–2 paragraphs (session flow, feel, downtime)
  aftercare: string;         // 1–2 paragraphs
  duration: string;          // e.g. "45–60 minutes per session"
  sessions: string;          // e.g. "6–10 sessions recommended"
  faqs: ServiceFaq[];        // shown in an accordion
  disclaimer?: string;       // optional safety / results-vary note
};

export const SERVICES_CONTENT: Record<string, ServiceContent> = {
  "fat-melting": {
    slug: "fat-melting",
    tagline: "Target small areas of resistant fat and improve body contour",
    overview: "Fat melting is a broad term for non surgical and minimally invasive treatments designed to reduce or reshape selected pockets of fat. Depending on the treatment area, skin condition and your suitability, Melt Aways may recommend ultrasonic cavitation, radiofrequency body contouring, Endolift or a combination of appropriate techniques. These treatments are intended to refine body contours rather than produce major weight loss. A consultation is required to determine which option may be suitable and what level of change would be realistic.",
    howItWorks: "Fat reduction treatments use different forms of controlled energy or tissue treatment to target localised fat. Some methods may disrupt or damage selected fat cells so their contents can be gradually processed by the body. Others primarily tighten the surrounding tissue, encourage collagen activity or improve the visible shape of the area. Your treatment begins with a body assessment, followed by a personalised recommendation based on the location and depth of the fat, skin firmness, medical history and desired outcome.",
    benefits: ["May reduce the appearance of small pockets of resistant fat",
    "Refines the contour of selected areas",
    "May improve definition around the waist, abdomen or jawline",
    "Supports a smoother and more balanced body shape",
    "May improve skin firmness when combined with a tightening treatment",
    "Can complement a wider body contouring programme",
    "May support visible contour improvements after weight loss"],
    idealFor: ["Lower or upper abdominal fullness",
    "Fat around the waist and love handles",
    "Small areas of back or bra line fullness",
    "Upper arm fullness",
    "Inner or outer thigh fullness",
    "Small pockets of fat around the hips",
    "Fullness beneath the chin",
    "Reduced jawline definition",
    "Localised fat remaining after weight loss",
    "Uneven contours following changes in body weight"],
    whatToExpect: "The treatment experience depends on the method selected. External body contouring may involve a handheld applicator being moved across the skin while your comfort and the treatment area are monitored. You may experience warmth, pressure, vibration, tingling, pulling or temporary tenderness. Ultrasonic cavitation may also produce a ringing sound during treatment. Endolift follows a different clinical process because a fine laser fibre is introduced beneath the skin and may require local anaesthetic. Results generally develop gradually, and temporary swelling or fluid changes may initially affect the appearance of the treated area.",
    aftercare: "Aftercare will depend on the treatment performed. You may be advised to keep the area clean, maintain normal hydration unless medically restricted, resume light movement, avoid excessive heat and avoid rubbing sensitive skin. Compression garments, temporary exercise restrictions or additional recovery instructions may apply after minimally invasive treatment. Continue balanced eating and regular physical activity to help maintain your results. Contact Melt Aways if you develop severe pain, blistering, unusual discolouration, worsening swelling, fever or another unexpected reaction. The instructions provided by your practitioner should always take priority.",
    duration: "Treatment time varies according to the method selected, the size and number of areas being treated and whether techniques are being combined. Your expected appointment length will be confirmed during consultation.",
    sessions: "The number of sessions depends on the treatment, area and intended result. External treatments such as ultrasonic cavitation may be recommended as a spaced series, while some minimally invasive procedures may involve one treatment followed by a review. Additional sessions should be based on reassessment and how your body responds rather than a fixed package alone.",
    faqs: [{
      question: "When may I notice a difference?",
      answer: "Some clients may notice temporary changes in the shape or feel of the area shortly after treatment. Meaningful fat reduction generally develops gradually as the body responds. Timing may be influenced by the selected treatment, amount and depth of fat, skin firmness, weight stability, lifestyle and the number of sessions completed."
    },
    {
      question: "How long may the results last?",
      answer: "Results may be maintained for an extended period, but the remaining fat cells can still enlarge if body weight increases. Stable weight, balanced nutrition, regular physical activity, adequate sleep and suitable maintenance treatments may help preserve the outcome."
    },
    {
      question: "Does fat reduction hurt?",
      answer: "Many external treatments produce manageable sensations such as warmth, pressure, vibration or tenderness. Endolift may involve local anaesthetic and can cause temporary swelling, tenderness or bruising. Tell your practitioner immediately if you experience burning, sharp pain or anything unusual."
    },
    {
      question: "Is there downtime?",
      answer: "External treatments often require little interruption to normal activities. Temporary redness, warmth, tenderness, swelling, bruising, tingling, numbness or skin sensitivity may occur. Minimally invasive treatments such as Endolift may require more recovery time and specific aftercare."
    },
    {
      question: "Is fat melting a weight-loss treatment?",
      answer: "No. Fat melting is intended to refine selected areas of localised fat rather than treat general weight gain or produce major weight loss. It does not replace exercise, balanced nutrition or medically supervised weight management."
    },
    {
      question: "Are fat reduction treatments safe?",
      answer: "Non surgical fat reduction may be performed safely when the client is appropriately assessed and suitable equipment is used by a properly trained practitioner. However, every treatment carries possible risks. The risks associated with the specific method should be explained before consent."
    },
    {
      question: "Who may require medical clearance or postponed treatment?",
      answer: "Treatment may need to be postponed or medically cleared if you are pregnant or breastfeeding, have an active infection, unexplained lump, hernia, bleeding disorder, uncontrolled diabetes, reduced sensation, liver or kidney disease, implanted electronic device, recent surgery, significant circulatory condition or another condition that could affect treatment or recovery."
    }],
  },
  "skin-tightening": {
    slug: "skin-tightening",
    tagline: "Advanced skin tightening and fat reduction from beneath the skin",
    overview: "Endolift is a minimally invasive laser treatment designed to tighten loose tissue, stimulate collagen production and reduce small pockets of localised fat. A fine optical fibre delivers controlled laser energy beneath the skin, allowing selected facial and body areas to be treated without traditional surgical incisions. Endolift is intended for contour refinement and modest fat reduction rather than major weight loss or surgical-level lifting. A consultation is required to determine whether it is appropriate for your skin, concerns and desired outcome.",
    howItWorks: "Following an assessment, the selected treatment areas are carefully mapped, cleansed and prepared. Local anaesthesia or other comfort measures may be used when appropriate. A sterile, single-use optical microfibre is then introduced beneath the skin through a very small entry point. Controlled laser energy is delivered directly to the targeted tissue to encourage tightening, stimulate new collagen production and reduce localised fat where appropriate. The fibre is removed after treatment, and the area is examined before personalised aftercare instructions are provided.",
    benefits: ["Tightens loose skin and underlying tissue",
    "Stimulates the production of new collagen",
    "May improve mild to moderate skin laxity",
    "May reduce small pockets of localised fat",
    "Improves facial and body definition",
    "Supports a firmer and smoother appearance",
    "May refine the jawline and lower face",
    "Provides a minimally invasive alternative for selected concerns",
    "Can complement a broader body contouring programme"],
    idealFor: ["Loose or mildly sagging skin",
    "Reduced jawline definition",
    "Fullness beneath the chin",
    "Early jowling",
    "Age-related changes in facial shape",
    "Small pockets of resistant fat",
    "Loose skin following changes in body weight",
    "Areas requiring greater firmness or definition",
    "Loose skin around the neck or lower face",
    "Selected areas of the abdomen, upper arms or thighs",
    "Fullness around the bra line, back or flanks",
    "Clients seeking improvement without traditional surgery"],
    whatToExpect: "Your appointment begins with an assessment of your skin, underlying tissue, localised fat, medical history and desired result. During treatment, you may feel pressure, warmth or movement beneath the skin. The procedure is carefully controlled according to the area, tissue condition and intended outcome. Temporary swelling, redness, tenderness, bruising, tightness, sensitivity, numbness or mild unevenness may occur while the area settles. Some improvement may be noticeable following treatment, but further tightening and definition may develop gradually over the following weeks and months as collagen production increases.",
    aftercare: "Follow the personalised instructions provided by your medical practitioner. You may be advised to keep the treatment area clean, avoid rubbing or placing unnecessary pressure on sensitive tissue and temporarily avoid strenuous exercise, excessive heat, alcohol or certain skincare products. Medication, compression garments or additional precautions may be recommended depending on the area treated. Attend your scheduled progress review and contact Melt Aways promptly if you experience severe or worsening pain, excessive swelling, unusual discolouration, blistering, bleeding, fever, discharge or another unexpected reaction.",
    duration: "Procedure time varies according to the size, location and number of areas being treated. Your expected appointment length, preparation requirements and recovery period will be explained during your consultation.",
    sessions: "Some clients may achieve their desired improvement after one Endolift procedure. Others may benefit from additional treatment or a different approach. Recommendations are based on the condition of the tissue, the area being treated, your response and the result you would reasonably like to achieve.",
    faqs: [{
      question: "When may I see results?",
      answer: "Some tightening or improvement in definition may be noticeable after treatment. Results can continue developing over the following weeks and months as new collagen is produced and temporary swelling settles. The speed and extent of improvement vary between clients."
    },
    {
      question: "Is Endolift a weight-loss treatment?",
      answer: "No. Endolift is intended to tighten selected areas, improve definition and reduce modest pockets of localised fat. It is not designed for general weight loss, large-volume fat removal or the treatment of obesity."
    },
    {
      question: "Is Endolift painful?",
      answer: "Comfort levels vary. You may feel warmth, pressure or movement beneath the skin during the procedure. Local anaesthesia or other appropriate comfort measures may be used, and your medical team will monitor you throughout treatment."
    },
    {
      question: "Is there downtime?",
      answer: "Endolift is minimally invasive, but a recovery period should still be expected. Temporary swelling, redness, bruising, tenderness, tightness, sensitivity, numbness or mild unevenness may occur. Downtime depends on the treatment area, procedure intensity and your body’s response."
    },
    {
      question: "How many treatments will I need?",
      answer: "Some clients may require only one procedure, while others may benefit from additional treatment or a complementary approach. Your plan will be based on reassessment and your response rather than automatically recommending more sessions."
    },
    {
      question: "Can Endolift be performed on the face and body?",
      answer: "Yes, where medically appropriate. Facial areas may include the jawline, lower face, jowls, cheeks, neck and beneath the chin. Selected body areas may include the abdomen, upper arms, inner thighs, knees, back, bra-line area and flanks."
    },
    {
      question: "Is Endolift safe?",
      answer: "Endolift may be performed safely when the client is properly assessed and the procedure is carried out by trained medical professionals using appropriate equipment, sterile single-use fibres and established protocols. Possible complications include burns, infection, bleeding, pigmentation changes, altered sensation, contour irregularities, asymmetry, scarring and injury to nearby tissue."
    },
    {
      question: "Who may not be suitable for Endolift?",
      answer: "Treatment may not be appropriate if you are pregnant or breastfeeding, have an active infection or open wound, a bleeding or clotting disorder, uncontrolled diabetes, impaired healing, abnormal scarring, certain implanted medical devices or a significant underlying medical condition. Blood-thinning medication, recent treatment in the same area or expectations of surgical-level lifting may also affect suitability."
    }],
  },
  "anti-aging": {
    slug: "anti-aging",
    tagline: "Support firmer, smoother and healthier-looking skin",
    overview: "Non surgical anti ageing treatments are designed to soften visible signs of ageing and improve the overall quality of the skin without traditional surgery. Depending on your concerns, treatment may focus on hydration, collagen support, firmness, pigmentation, facial definition, texture or brightness. At Melt Aways, your skin is assessed before treatment so that recommendations reflect its present condition, your health history and the improvement you would realistically like to achieve.",
    howItWorks: "Anti ageing care may involve one carefully selected treatment or a planned combination of techniques. Depending on your skin and the services considered suitable, this may include radiofrequency skin firming, microcurrent treatment, LED light therapy, rejuvenating facials, chemical exfoliation, ultrasound based treatment or another collagen supporting procedure. These methods work in different ways to hydrate the skin, support renewal, encourage collagen activity, improve firmness or address uneven tone and texture. Your practitioner will explain what each recommended procedure is intended to improve before treatment begins.",
    benefits: ["May soften the appearance of fine lines",
    "Supports firmer-looking skin",
    "May encourage collagen and elastin activity",
    "Improves skin hydration and softness",
    "May refine uneven texture and visible pores",
    "Supports a brighter and more refreshed complexion",
    "May improve selected pigmentation concerns",
    "Can enhance facial firmness and definition",
    "Supports the overall quality and condition of mature skin",
    "Provides personalised care without traditional surgery"],
    idealFor: ["Fine lines and mild wrinkles",
    "Reduced skin firmness",
    "Early facial sagging",
    "Dull or tired-looking skin",
    "Dryness and dehydration",
    "Uneven skin texture",
    "Enlarged or visible pores",
    "Sun-related skin changes",
    "Uneven pigmentation",
    "Reduced jawline definition",
    "Crepey-looking skin",
    "Changes affecting the neck and upper chest",
    "A general loss of brightness or vitality"],
    whatToExpect: "Your appointment begins with an assessment of your skin type, sensitivity, hydration, texture, firmness, pigmentation, facial structure, current skincare and relevant health history. The treatment area will usually be cleansed before an appropriate gel, serum, protective layer or treatment product is applied. Depending on the procedure selected, you may experience gentle warmth, cooling, pressure, tingling, mild vibration, temporary tightness, light stinging or facial muscle movement. Your practitioner will monitor your comfort and skin response throughout the session. Some treatments may produce an immediate refreshed appearance, while improvements involving collagen, firmness or skin renewal generally develop more gradually.",
    aftercare: "Aftercare will depend on the procedure performed and your skin’s response. You may be instructed to keep the area clean, use gentle skincare, apply a suitable moisturiser and protect exposed skin with sunscreen. Avoid unnecessary heat, direct sun exposure, picking, rubbing or exfoliating sensitive skin. Strong acids, retinoids, active ingredients and heavy makeup may need to be paused for the period advised. Maintain normal hydration unless medically restricted. Contact Melt Aways if you experience blistering, severe pain, worsening swelling, unusual discolouration or another unexpected reaction. Instructions provided during your appointment should always take priority.",
    duration: "Appointment length varies according to the treatment selected, the areas being treated and whether more than one suitable technique is included. Your expected treatment and recovery time will be explained during consultation.",
    sessions: "Some clients may notice a refreshed appearance after one facial or hydrating treatment. Procedures intended to improve collagen activity, firmness, pigmentation or texture may require a carefully spaced series. The number of appointments will depend on your skin, the concern being addressed, the selected procedure, recovery requirements and your response. Occasional maintenance may be recommended where appropriate.",
    faqs: [{
      question: "When may I notice a difference?",
      answer: "Some treatments may leave the skin looking brighter, smoother or more hydrated shortly after the appointment. Improvements involving collagen production, firmness or skin renewal usually develop over a longer period. The timing and extent of change depend on your skin, general health, treatment type, lifestyle and consistency with the recommended plan."
    },
    {
      question: "How long may the results last?",
      answer: "The duration of improvement depends on the procedure and concern being treated. Sun protection, suitable skincare, healthy lifestyle habits and occasional maintenance may help preserve your results. However, no aesthetic procedure can permanently stop natural ageing, facial movement, hormonal changes or future environmental damage."
    },
    {
      question: "Do anti ageing treatments hurt?",
      answer: "Many non surgical treatments cause little discomfort, although the experience varies. You may feel warmth, tingling, pressure or temporary sensitivity. Procedures using stronger energy or deeper exfoliation may feel more intense. Tell your practitioner immediately if you experience burning, sharp pain or unexpected discomfort."
    },
    {
      question: "Is there downtime?",
      answer: "Many treatments allow you to resume your routine shortly afterwards. Depending on the procedure, temporary redness, warmth, swelling, tenderness, dryness, flaking, tightness, sensitivity, bruising or darkening of pigmentation may occur. Your expected recovery period will be discussed before treatment."
    },
    {
      question: "Which anti ageing treatment is right for me?",
      answer: "The appropriate treatment depends on whether your primary concern involves dryness, texture, pigmentation, reduced firmness, facial definition or another factor. Your skin should be assessed before a recommendation is made, as not every person needs the same procedure or combination."
    },
    {
      question: "Can different treatments be combined?",
      answer: "Suitable treatments may sometimes be combined as part of a planned programme. However, combining multiple procedures without a clear clinical reason may irritate the skin and will not necessarily improve the result. The timing and compatibility of each treatment should be considered carefully."
    },
    {
      question: "Are anti ageing treatments safe?",
      answer: "Non surgical anti ageing procedures may be performed safely when the client is properly assessed and suitable products, equipment and settings are used by a trained practitioner. Possible risks vary by treatment and may include persistent irritation, burns, blistering, allergic reactions, pigmentation changes, infection, scarring, prolonged swelling, uneven results or eye injury when appropriate protection is not used."
    },
    {
      question: "Who may need treatment postponed or medical clearance?",
      answer: "Treatment may need to be changed, postponed or medically cleared if you are pregnant or breastfeeding, have an active infection, rash, wound, sunburn, impaired healing, uncontrolled diabetes, abnormal scarring, reduced skin sensation, certain implants or a significant medical condition. Photosensitising medication, prescription acne medication, recent injectables, laser treatment, chemical peels or an unexplained skin lesion may also affect suitability."
    },
    {
      question: "Will anti ageing treatment change how my face looks?",
      answer: "The aim is to improve selected concerns while preserving your natural features. These treatments cannot stop ageing or guarantee a permanently younger appearance. A thoughtful care plan should help you look refreshed and well cared for without creating an artificial or unfamiliar result."
    }],
  },
  "breast-filler": {
    slug: "breast-filler",
    tagline: "Personalised fullness and contour enhancement without surgery",
    overview: "Injectable breast enhancement is a medical aesthetic procedure that uses a selected filler to add limited volume or refine specific areas of the breasts without implants or fat-transfer surgery. Depending on your anatomy and medical suitability, it may be considered for subtle fullness, mild asymmetry or selected contour irregularities. It does not provide the lifting or enlargement possible with surgery. Because breast injections carry serious risks and may interfere with future breast screening, a detailed medical assessment, full product disclosure and informed consent are essential before treatment.",
    howItWorks: "Following a medical and breast assessment, the proposed treatment areas are photographed, measured and carefully marked. The exact filler, its regulatory status, expected duration, possible risks and available methods of managing complications should be explained before treatment. The skin is cleansed, and local anaesthesia or another comfort measure may be used. A qualified medical professional then places controlled amounts of filler into selected areas using medically appropriate injection equipment. Treatment may be staged to monitor healing, symmetry, tissue response and how the product settles before any additional filler is considered.",
    benefits: ["May provide a limited increase in breast fullness",
    "May improve mild differences in breast size",
    "Can restore the appearance of some upper-breast fullness",
    "May refine selected contour depressions",
    "Can create a subtly fuller-looking outline",
    "May improve balance between the breasts",
    "Offers a non surgical option for carefully selected clients",
    "Allows treatment to be planned in controlled stages",
    "Focuses on subtle enhancement rather than major enlargement"],
    idealFor: ["Mild differences in breast size",
    "Limited loss of breast fullness",
    "A flatter-looking upper breast",
    "Selected contour depressions or irregularities",
    "Subtle cleavage enhancement",
    "Modest improvement in overall breast balance",
    "Clients seeking a small and carefully planned change",
    "Clients with realistic expectations about non surgical enhancement",
    "Clients medically cleared for treatment with the proposed filler"],
    whatToExpect: "Your consultation should include a review of your breast health, medical history, medication, allergies, previous procedures, breast imaging and personal or family history of breast disease. The breasts may be examined, photographed, measured and marked before treatment. During injection, you may experience stinging, pressure, tightness, fullness or discomfort. The area is assessed afterwards for symmetry, circulation, swelling, bleeding, sensation and immediate reactions. Some fullness may be visible immediately, although swelling can temporarily distort the result. Tenderness, bruising, firmness, temporary asymmetry, altered sensation or small irregularities may occur while the area settles.",
    aftercare: "Keep the injection sites clean and dry as instructed and wear the recommended supportive garment. Do not rub, press or aggressively massage the breasts unless specifically advised. Follow all sleeping and positioning instructions, avoid strenuous exercise and excessive heat for the period directed and do not apply unapproved products to the injection sites. Attend every scheduled review and retain the name, manufacturer, batch information and treatment date of the filler used. Contact Melt Aways immediately for increasing pain, heat, redness, discharge, unusual firmness or changes in skin colour, temperature or sensation. Seek emergency care for chest pain, difficulty breathing, fainting, confusion, sudden weakness or another severe reaction.",
    duration: "Procedure time depends on the product selected, amount administered, treatment areas and whether the enhancement is completed in stages. Consultation, preparation, monitoring and recovery requirements will be explained before treatment.",
    sessions: "Some clients may receive treatment during one appointment, while others may require a staged approach. Additional filler should only be considered after healing, symmetry, product settling and tissue response have been properly reviewed. More filler does not automatically provide a safer or more natural result.",
    faqs: [{
      question: "When may I notice results?",
      answer: "Some fullness may be visible immediately, but swelling can temporarily affect the appearance of the breasts and should not be mistaken for the final result. The outcome becomes clearer as swelling settles and the product integrates with the surrounding tissue. A particular cup size, measurement or amount of cleavage cannot be guaranteed."
    },
    {
      question: "Is injectable breast enhancement a breast lift?",
      answer: "No. Filler may create the appearance of additional fullness, but it cannot remove excess skin, reposition the nipples, correct significant sagging or provide the result of a surgical breast lift. A plastic-surgery consultation may be more appropriate when sagging or nipple position is the primary concern."
    },
    {
      question: "How long may the results last?",
      answer: "Duration depends on the exact product, amount administered, placement, individual metabolism, weight changes, pregnancy, breastfeeding and natural changes in breast tissue. A reliable timeframe cannot be given until the proposed filler has been identified and assessed."
    },
    {
      question: "Can breast filler be removed?",
      answer: "That depends entirely on the injected material. Some fillers may have a method of partial or attempted reversal, while others can be difficult or impossible to remove completely. Correction may require additional injections, imaging, drainage, surgery or treatment for infection and inflammation. Reversal may not correct tissue damage, scarring or migrated product."
    },
    {
      question: "Does injectable breast enhancement hurt?",
      answer: "You may experience stinging, pressure, tightness or fullness during treatment, followed by temporary tenderness, swelling or soreness. Severe or worsening pain, particularly when accompanied by skin-colour or temperature changes, requires immediate medical attention."
    },
    {
      question: "Is there downtime?",
      answer: "Some interruption to your normal routine may be required. Temporary swelling, bruising, tenderness, tightness, firmness, altered sensation, sleeping discomfort, small lumps or unevenness may occur. Recovery depends on the product, amount injected, placement and your individual response."
    },
    {
      question: "Will breast filler affect future breast screening?",
      answer: "It may. Breast filler can create lumps, shadows or other changes during mammograms, ultrasounds, MRI scans and physical examinations. Always tell your doctor and breast-imaging provider that filler is present and provide the product name, treatment date and injected areas."
    },
    {
      question: "What should I know about the product being injected?",
      answer: "Before treatment, you should receive the exact product name, active material, manufacturer, source, batch information, expiration date, regulatory status, intended medical use, expected duration, known risks and available removal or management options. You should also be told whether breast enhancement is an approved or off-label use. Do not proceed when the substance is described only by a vague term such as body filler, modelling gel or biopolymer."
    },
    {
      question: "Can injectable silicone or needle-free devices be used?",
      answer: "Free liquid silicone should not be injected for cosmetic breast enhancement because it can migrate and cause severe or permanent complications. High-pressure needle-free devices should also not be used because they may not provide adequate control over the amount, depth and location of the product."
    },
    {
      question: "Is injectable breast enhancement safe?",
      answer: "Proper assessment, sterile equipment, a verified product and an appropriately qualified medical professional may reduce risk, but cannot make the procedure risk-free. Complications may include infection, bleeding, inflammatory reactions, hard nodules, migration, asymmetry, altered sensation, tissue damage, blocked blood vessels, embolism, lung complications, interference with breast imaging, permanent deformity, serious injury or death. Certain problems may emerge months or years later."
    },
    {
      question: "Who may not be suitable?",
      answer: "Treatment may be unsuitable if you are pregnant, breastfeeding or attempting pregnancy; have an unexplained lump, nipple discharge, abnormal imaging, active breast disease, infection, bleeding disorder, uncontrolled diabetes, impaired healing, significant sagging or a serious underlying condition. Previous injections involving an unknown filler, silicone or biopolymer also require careful investigation. Medical clearance, imaging or referral to a breast specialist or plastic surgeon may be necessary."
    }],
  },
  "muscle-toning": {
    slug: "muscle-toning",
    tagline: "Strengthen the look of selected muscles and create firmer body definition",
    overview: "Muscle toning is a non surgical body contouring treatment that uses controlled electrical or electromagnetic stimulation to produce repeated contractions within selected muscle groups. Depending on the equipment available and the area being treated, Melt Aways may use Emsculpt or a similar body sculpting system. Treatment is intended to support muscle conditioning, visible firmness and body definition. It does not replace strength training, regular movement, balanced nutrition or medical rehabilitation.",
    howItWorks: "Applicators are positioned over the selected muscle group and secured where necessary. The device delivers controlled electrical impulses or an electromagnetic field that activates the nerves responsible for muscle movement. This produces repeated involuntary contractions without requiring you to perform each movement consciously. Treatment begins at a manageable intensity and may be increased gradually according to your comfort, muscle response and the protocol for the selected equipment. Muscle stimulation may be used independently or combined with separate treatments for fat reduction, skin firmness or temporary fluid retention when appropriate.",
    benefits: ["May improve the appearance of muscle tone",
    "Supports firmer looking body contours",
    "May create greater definition in selected areas",
    "Encourages stronger engagement of targeted muscles",
    "May improve the appearance of the abdomen or buttocks",
    "Can support muscle reconditioning after reduced activity where appropriate",
    "Complements regular exercise and an active lifestyle",
    "May support visible tone following weight changes",
    "Can form part of a wider body contouring programme"],
    idealFor: ["Limited abdominal definition",
    "A soft or poorly conditioned appearance",
    "Reduced muscle tone following weight loss",
    "Difficulty engaging selected muscles during exercise",
    "Changes in abdominal tone following pregnancy",
    "Reduced buttock firmness",
    "Limited definition in the thighs",
    "Muscle deconditioning following a period of inactivity",
    "Maintaining visible tone alongside regular exercise",
    "Clients seeking greater firmness in selected muscle groups",
    "Suitable areas of the abdomen, buttocks, thighs, calves or upper arms"],
    whatToExpect: "Your appointment begins with an assessment of the targeted muscle group, existing tone, surrounding fat, skin firmness, exercise habits, previous injuries, operations and relevant health conditions. The applicators are positioned to produce a balanced contraction, and the session usually begins at a lower intensity. You may experience strong contractions, tightening, rhythmic pulsing, pressure, tingling, tapping, vibration or temporary cramping. The sensation can feel unusual and intense but should remain manageable. Mild soreness or fatigue may occur afterwards, similar to the feeling following a demanding workout. Visible changes generally develop gradually rather than immediately.",
    aftercare: "Maintain normal hydration unless medically restricted and continue gentle movement after treatment. Allow the targeted muscles adequate time to recover and avoid immediately overtraining an area that feels sore or fatigued. You may resume your regular exercise routine when comfortable. Continue balanced nutrition and appropriate physical activity to support and maintain visible muscle tone. Avoid rubbing or irritating sensitive skin and follow any instructions provided for the equipment used. Contact Melt Aways if you experience severe pain, significant weakness, persistent cramping, blistering, unusual swelling or another concerning reaction.",
    duration: "Appointment length varies according to the equipment used, the muscle group being treated, the number of areas selected and the intensity of the session. Your expected treatment time will be confirmed during consultation.",
    sessions: "Muscle toning is commonly planned as a short, carefully spaced series rather than a single appointment. The number of sessions depends on the device, treatment area, starting muscle condition, intensity, response and desired level of definition. Muscles require time to recover and adapt, so more frequent treatment is not automatically more effective. Maintenance sessions may be recommended where appropriate.",
    faqs: [{
      question: "When may I notice a difference?",
      answer: "The area may temporarily feel tighter immediately after treatment because the muscles have contracted repeatedly. Visible improvements may develop more gradually as the muscles respond and recover between sessions. Results depend on your starting muscle condition, surrounding fat, skin firmness, treatment intensity, completed sessions, exercise habits, nutrition and individual response."
    },
    {
      question: "How long may the results last?",
      answer: "Visible improvements may be easier to maintain with regular strength training, consistent physical activity, balanced nutrition, stable body weight, adequate rest and suitable maintenance treatments. Without continued activity, muscles can gradually lose conditioning. Treatment cannot permanently prevent future loss of tone, weight gain, pregnancy related changes or natural ageing."
    },
    {
      question: "Does muscle toning hurt?",
      answer: "The contractions may feel intense, tight or demanding, but they should remain manageable. Some clients experience temporary cramping or mild muscle soreness afterwards. The intensity should be adjusted to your tolerance, and stronger settings should not be used simply to create the impression of a more effective treatment."
    },
    {
      question: "Is there downtime?",
      answer: "Most clients can return to their normal routine after treatment. Temporary soreness, localised fatigue, mild redness, tenderness, tingling, cramping, tightness, skin sensitivity or temporary weakness may occur. Severe pain, significant weakness or worsening symptoms should be reported promptly."
    },
    {
      question: "Is muscle toning the same as exercise?",
      answer: "No. The device can produce repeated contractions within a selected muscle group, but it does not train cardiovascular fitness, coordination, balance, mobility, bone strength, endurance or full body functional movement. Muscle stimulation works best as a body contouring aid alongside regular exercise rather than as a replacement for physical activity."
    },
    {
      question: "Does muscle toning burn fat?",
      answer: "That depends on the exact equipment and treatment settings. Some electromagnetic systems are designed to affect both muscle and fat, while others primarily stimulate muscle contractions. If a significant layer of fat covers the targeted muscle, separate fat reduction treatment may be considered. Muscle toning should not be presented as effortless weight loss or a treatment for obesity."
    },
    {
      question: "Can muscle toning be combined with other treatments?",
      answer: "Yes, when each treatment has a clear purpose and the combination is considered suitable. Muscle stimulation may address the underlying muscle, while cavitation or another method may target selected fat. Radiofrequency may address reduced skin firmness, and lymphatic drainage may assist with temporary fluid retention. Combining multiple treatments does not automatically produce a better result."
    },
    {
      question: "Is muscle toning safe?",
      answer: "Muscle stimulation may be performed safely when the client is properly screened, suitable equipment is used and the applicators are positioned according to the manufacturer’s instructions. Possible reactions include muscle pain, cramping, redness, swelling, bruising, skin irritation, altered sensation, burns with certain electrical devices, aggravation of an existing injury or interference with implanted electronic devices."
    },
    {
      question: "Who may need treatment postponed or medical clearance?",
      answer: "Treatment may need to be postponed, changed or medically cleared if you are pregnant, recently gave birth or are breastfeeding; have a pacemaker, defibrillator, copper intrauterine device or another implanted electronic or metal device; or have epilepsy, heart disease, a blood clot, hernia, severe abdominal separation, recent surgery, reduced sensation, an active infection, an unresolved injury, uncontrolled diabetes, kidney disease, cancer or a significant muscle, nerve or circulatory condition. Suitability must be assessed using the guidance for the exact device."
    }],
  },
  "butt-filler": {
    slug: "butt-filler",
    tagline: "",
    overview: "",
    howItWorks: "",
    benefits: [],
    idealFor: [],
    whatToExpect: "",
    aftercare: "",
    duration: "",
    sessions: "",
    faqs: [],
  },
  "cavitation": {
    slug: "cavitation",
    tagline: "",
    overview: "",
    howItWorks: "",
    benefits: [],
    idealFor: [],
    whatToExpect: "",
    aftercare: "",
    duration: "",
    sessions: "",
    faqs: [],
  },
  "lymphatic-drainage": {
    slug: "lymphatic-drainage",
    tagline: "Gentle support for fluid movement, swelling and recovery",
    overview: "Lymphatic drainage is a gentle treatment intended to encourage lymph fluid through the body’s natural drainage pathways. Depending on the cause of your concern and your medical suitability, it may help reduce temporary puffiness, ease feelings of heaviness and support selected recovery or body-contouring programmes. Treatment may be performed manually, using controlled mechanical compression or through a planned combination of techniques. Unexplained, sudden or one-sided swelling should be medically assessed before treatment.",
    howItWorks: "Manual lymphatic drainage uses light, slow and rhythmic movements applied in specific directions across the skin. These movements are intended to encourage lymph fluid towards pathways where it may drain more effectively. Mechanical treatment may use a compression garment that gently inflates and releases in a controlled sequence. The appropriate method, pressure and treatment direction are selected according to the area, cause of swelling, medical history and condition of the lymphatic system. This treatment differs from deep-tissue massage and should not require aggressive pressure.",
    benefits: ["May reduce the appearance of temporary puffiness",
    "Encourages the movement of excess fluid",
    "May ease feelings of heaviness or tightness",
    "Supports comfort in areas affected by temporary swelling",
    "May assist selected post-treatment recovery plans",
    "Can support body-contouring aftercare when appropriate",
    "May create a temporarily smoother appearance",
    "Can provide a gentle and relaxing treatment experience",
    "May complement medically guided compression and movement"],
    idealFor: ["Temporary puffiness or fluid retention",
    "Feelings of heaviness in suitable areas",
    "Temporary swelling following an approved aesthetic treatment",
    "Medically cleared post-surgical recovery",
    "Clients requiring gentle rather than deep massage",
    "Fluid-related fullness around the abdomen or waist",
    "Suitable swelling affecting the arms or legs",
    "Facial or neck puffiness",
    "Clients receiving a structured lymphatic-care plan",
    "Suitable areas of the back, hips or thighs"],
    whatToExpect: "Your appointment begins with an assessment of the swelling, when it started, recent procedures, medication and relevant heart, kidney, circulatory or lymphatic conditions. For manual drainage, you will usually lie down or remain slightly elevated while the practitioner applies light, rhythmic movements to the skin. For mechanical treatment, a compression garment may be fitted around the selected area and adjusted to an appropriate pressure. You may feel gentle movement, light pressure or relaxation. Treatment should not feel aggressively deep or sharply painful. Tell your practitioner immediately if you experience pain, numbness, dizziness, nausea, difficulty breathing or another unexpected symptom.",
    aftercare: "Maintain your normal hydration unless a healthcare provider has restricted your fluid intake. Continue gentle movement, such as comfortable walking, when appropriate, and avoid unusually strenuous exercise if you feel tired or light-headed. Keep the skin clean, use a suitable moisturiser and wear compression garments only when prescribed or recommended. Do not perform aggressive massage over the treated area. Follow your surgeon’s instructions when drainage forms part of post-surgical care. Seek urgent medical attention for chest pain, difficulty breathing, fainting or sudden one-sided swelling.",
    duration: "Appointment length varies according to the method used, number and size of the areas treated, medical considerations and whether the session forms part of post-surgical care. Your expected treatment time will be confirmed following assessment.",
    sessions: "Some clients may receive lymphatic drainage as an occasional wellness treatment, while others may require a structured programme based on surgery, diagnosed lymphedema or another medical concern. The recommended number and frequency of sessions depend on the cause and amount of swelling, treatment area, medical guidance, stage of recovery and response. More frequent treatment is not automatically more effective.",
    faqs: [{
      question: "When may I notice a difference?",
      answer: "Some clients may notice a temporary reduction in puffiness, heaviness or tightness following treatment, while others experience a more subtle response. The amount and duration of improvement depend on the cause of the swelling, general health, recent procedures, activity level, treatment method and individual response."
    },
    {
      question: "How long may the effects last?",
      answer: "When the concern involves temporary fluid retention, the visible improvement may also be temporary. Activity, hormonal changes, sodium intake, heat, travel, surgery, compression use and underlying medical conditions may influence how long the effect remains noticeable."
    },
    {
      question: "Does lymphatic drainage remove fat?",
      answer: "No. Lymphatic drainage does not melt fat, permanently remove cellulite or produce true weight loss. Any temporary reduction in measurements or body weight is more likely to reflect changes in fluid and swelling rather than the removal of body fat."
    },
    {
      question: "Does lymphatic drainage hurt?",
      answer: "Manual lymphatic drainage should generally feel gentle and rhythmic. Mechanical compression may feel firm as the garment inflates, but it should not cause sharp pain, numbness or difficulty breathing. Tender post-surgical areas require adjusted pressure and appropriate medical guidance."
    },
    {
      question: "Is there downtime?",
      answer: "Most suitable clients can return to their regular activities after treatment. Temporary increased urination, mild tiredness, light-headedness, tenderness, skin redness or changes in the sensation of pressure may occur. Severe pain, significant bruising or worsening swelling should be reported."
    },
    {
      question: "Can lymphatic drainage be performed after surgery?",
      answer: "It may be included in selected recovery plans, but treatment should begin only after the surgeon or responsible medical provider confirms that it is appropriate. The timing, pressure and technique must reflect the operation, stage of healing, condition of incisions and the surgeon’s instructions."
    },
    {
      question: "Can lymphatic drainage be performed after an aesthetic treatment?",
      answer: "It may be suitable after certain aesthetic or body-contouring procedures when recommended by the treating practitioner. Suitability depends on the procedure, treatment area, timing, skin condition and cause of the swelling. It should not be performed over suspected infection or used to conceal signs of a complication."
    },
    {
      question: "Is lymphatic drainage safe?",
      answer: "Lymphatic drainage may be performed safely when the client is properly assessed and an appropriate technique and pressure are used. Possible adverse effects include skin irritation, tenderness, bruising, dizziness, numbness, worsening swelling, irritation of healing tissue and delayed recognition of an underlying medical condition."
    },
    {
      question: "Who may need treatment postponed or medical clearance?",
      answer: "Treatment may need to be postponed, adjusted or medically cleared if you have heart failure, kidney disease, an active infection, fever, suspected blood clot, sudden or one-sided swelling, uncontrolled high blood pressure, an open wound, severe circulatory disease, active cancer or diagnosed lymphedema. Recent surgery, lymph-node removal, pregnancy, restricted fluid intake, chest pain or difficulty breathing must also be disclosed."
    }],
  },
  "slimming-injections": {
    slug: "slimming-injections",
    tagline: "Target small areas of resistant fat and improve body contour",
    overview: "Fat melting is a broad term for non surgical and minimally invasive treatments designed to reduce or reshape selected pockets of fat. Depending on the treatment area, skin condition and your suitability, Melt Aways may recommend ultrasonic cavitation, radiofrequency body contouring, Endolift or a combination of appropriate techniques. These treatments are intended to refine body contours rather than produce major weight loss. A consultation is required to determine which option may be suitable and what level of change would be realistic.",
    howItWorks: "Fat reduction treatments use different forms of controlled energy or tissue treatment to target localised fat. Some methods may disrupt or damage selected fat cells so their contents can be gradually processed by the body. Others primarily tighten the surrounding tissue, encourage collagen activity or improve the visible shape of the area. Your treatment begins with a body assessment, followed by a personalised recommendation based on the location and depth of the fat, skin firmness, medical history and desired outcome.",
    benefits: ["May reduce the appearance of small pockets of resistant fat",
    "Refines the contour of selected areas",
    "May improve definition around the waist, abdomen or jawline",
    "Supports a smoother and more balanced body shape",
    "May improve skin firmness when combined with a tightening treatment",
    "Can complement a wider body contouring programme",
    "May support visible contour improvements after weight loss"],
    idealFor: ["Lower or upper abdominal fullness",
    "Fat around the waist and love handles",
    "Small areas of back or bra line fullness",
    "Upper arm fullness",
    "Inner or outer thigh fullness",
    "Small pockets of fat around the hips",
    "Fullness beneath the chin",
    "Reduced jawline definition",
    "Localised fat remaining after weight loss",
    "Uneven contours following changes in body weight"],
    whatToExpect: "The treatment experience depends on the method selected. External body contouring may involve a handheld applicator being moved across the skin while your comfort and the treatment area are monitored. You may experience warmth, pressure, vibration, tingling, pulling or temporary tenderness. Ultrasonic cavitation may also produce a ringing sound during treatment. Endolift follows a different clinical process because a fine laser fibre is introduced beneath the skin and may require local anaesthetic. Results generally develop gradually, and temporary swelling or fluid changes may initially affect the appearance of the treated area.",
    aftercare: "Aftercare will depend on the treatment performed. You may be advised to keep the area clean, maintain normal hydration unless medically restricted, resume light movement, avoid excessive heat and avoid rubbing sensitive skin. Compression garments, temporary exercise restrictions or additional recovery instructions may apply after minimally invasive treatment. Continue balanced eating and regular physical activity to help maintain your results. Contact Melt Aways if you develop severe pain, blistering, unusual discolouration, worsening swelling, fever or another unexpected reaction. The instructions provided by your practitioner should always take priority.",
    duration: "Treatment time varies according to the method selected, the size and number of areas being treated and whether techniques are being combined. Your expected appointment length will be confirmed during consultation.",
    sessions: "The number of sessions depends on the treatment, area and intended result. External treatments such as ultrasonic cavitation may be recommended as a spaced series, while some minimally invasive procedures may involve one treatment followed by a review. Additional sessions should be based on reassessment and how your body responds rather than a fixed package alone.",
    faqs: [{
      question: "When may I notice a difference?",
      answer: "Some clients may notice temporary changes in the shape or feel of the area shortly after treatment. Meaningful fat reduction generally develops gradually as the body responds. Timing may be influenced by the selected treatment, amount and depth of fat, skin firmness, weight stability, lifestyle and the number of sessions completed."
    },
    {
      question: "How long may the results last?",
      answer: "Results may be maintained for an extended period, but the remaining fat cells can still enlarge if body weight increases. Stable weight, balanced nutrition, regular physical activity, adequate sleep and suitable maintenance treatments may help preserve the outcome."
    },
    {
      question: "Does fat reduction hurt?",
      answer: "Many external treatments produce manageable sensations such as warmth, pressure, vibration or tenderness. Endolift may involve local anaesthetic and can cause temporary swelling, tenderness or bruising. Tell your practitioner immediately if you experience burning, sharp pain or anything unusual."
    },
    {
      question: "Is there downtime?",
      answer: "External treatments often require little interruption to normal activities. Temporary redness, warmth, tenderness, swelling, bruising, tingling, numbness or skin sensitivity may occur. Minimally invasive treatments such as Endolift may require more recovery time and specific aftercare."
    },
    {
      question: "Is fat melting a weight-loss treatment?",
      answer: "No. Fat melting is intended to refine selected areas of localised fat rather than treat general weight gain or produce major weight loss. It does not replace exercise, balanced nutrition or medically supervised weight management."
    },
    {
      question: "Are fat reduction treatments safe?",
      answer: "Non surgical fat reduction may be performed safely when the client is appropriately assessed and suitable equipment is used by a properly trained practitioner. However, every treatment carries possible risks. The risks associated with the specific method should be explained before consent."
    },
    {
      question: "Who may require medical clearance or postponed treatment?",
      answer: "Treatment may need to be postponed or medically cleared if you are pregnant or breastfeeding, have an active infection, unexplained lump, hernia, bleeding disorder, uncontrolled diabetes, reduced sensation, liver or kidney disease, implanted electronic device, recent surgery, significant circulatory condition or another condition that could affect treatment or recovery."
    }],
  },
  "peptides": {
    slug: "peptides",
    tagline: "Personalised peptide support for weight management, hormonal wellness and healthier-looking skin",
    overview: "Peptides are short chains of amino acids that act as signalling molecules within the body. Depending on the product selected, peptide therapy can support medically supervised weight management, clinically identified hormone-related concerns or improvements in the condition and appearance of the skin. Because different peptides have different purposes, benefits and safety considerations, treatment must be recommended according to the exact product, your health history and your individual goals. Prescription or injectable peptide therapy requires assessment and supervision by an appropriately licensed medical professional.",
    howItWorks: "Different peptides interact with specific receptors and biological pathways within the body. Weight-management peptides can influence appetite, fullness, digestion and metabolic activity. Hormone-related peptides can stimulate or regulate selected hormonal pathways when there is an appropriate clinical reason for treatment. Skincare peptides can support collagen activity, hydration, repair and the visible condition of the skin. Treatment begins with a consultation in which the clinician reviews your concerns, medical history, medications, allergies and relevant test results. If peptide therapy is considered suitable, the exact product, dosage, administration method, schedule and monitoring requirements will be explained.",
    benefits: ["Can help regulate appetite and reduce persistent food cravings",
    "Can support longer-lasting fullness and improved portion control",
    "Can contribute to meaningful weight loss when paired with nutrition and lifestyle support",
    "Can support reductions in waist circumference and improvements in overall body composition",
    "Can help improve selected markers of metabolic health during medically supervised weight management",
    "Can support healthy hormone activity when prescribed for a clinically identified hormonal concern",
    "Can target specific hormone-related symptoms or deficiencies through a personalised medical plan",
    "Can support energy, recovery, sexual wellness and physical wellbeing when an appropriate medical indication is identified",
    "Certain skincare peptides can support collagen and elastin activity",
    "Can soften the visible appearance of fine lines and early signs of ageing",
    "Can support firmer, smoother and more resilient-looking skin",
    "Can improve skin hydration, texture and overall radiance",
    "Can complement professional skincare and anti-ageing treatment programmes",
    "Provides a personalised approach based on the peptide selected, your health and your treatment goals"],
    idealFor: ["Adults seeking medically supervised weight-management support",
    "Persistent appetite or food cravings affecting weight-management efforts",
    "Adults who require individual assessment before beginning injectable treatment",
    "Clinically identified hormone-related concerns",
    "Selected symptoms associated with an appropriate hormonal or metabolic condition",
    "Clients seeking support for energy, recovery or sexual wellness where medically appropriate",
    "Fine lines and early visible signs of ageing",
    "Reduced skin firmness or elasticity",
    "Dry, dull or uneven-looking skin",
    "Clients seeking stronger collagen and skincare support",
    "Adults prepared to complete recommended examinations or laboratory testing",
    "Clients willing to follow prescribed dosing and monitoring requirements",
    "Clients seeking professional guidance instead of purchasing unverified peptide products"],
    whatToExpect: "Your first appointment includes a discussion about your health, concerns and desired outcome. The clinician can examine you, review existing laboratory results or request additional testing before recommending treatment. If peptide therapy is appropriate, you will be told the name of the product, its intended purpose, available evidence, expected benefits, limitations, alternatives and possible risks. Prescription peptides can be administered beneath the skin using a small needle, although the route and frequency depend on the selected medicine. Skincare peptides can instead be applied topically or included in a professional skincare programme. Temporary discomfort, redness, swelling, itching or bruising can occur around an injection site. Other effects depend on the particular peptide used.",
    aftercare: "Use prescription peptide medication only as directed and do not change the dose, frequency or injection schedule without medical approval. Follow the storage instructions supplied with the product, as certain peptide medicines require refrigeration and protection from light. Wash your hands before administration, use a new sterile needle where applicable, rotate approved injection sites and dispose of used sharps in a suitable container. Do not share medication or use a product prescribed for another person. Attend monitoring appointments and complete any requested laboratory testing. For topical skincare peptides, follow the recommended application instructions and use appropriate sun protection. Seek urgent medical assistance if you experience difficulty breathing, facial or throat swelling, fainting, severe abdominal pain, persistent vomiting, chest pain, a severe headache or another serious reaction.",
    duration: "The administration of an injection can be brief, but the initial medical consultation and follow-up appointments require additional time. Appointment length depends on the peptide being considered, the required health assessment, injection education and whether laboratory testing is needed. Topical peptide treatments vary according to the skincare procedure selected.",
    sessions: "There is no single peptide programme suitable for every client. Treatment frequency and duration depend on the exact product, treatment purpose, prescribed dosage, response, side effects and monitoring results. Weight-management and hormone-related peptide treatments can require ongoing medical supervision. Skincare peptides can be used through a planned professional treatment series or suitable homecare routine. Treatment should be adjusted or discontinued when it is ineffective, poorly tolerated or no longer medically appropriate.",
    faqs: [{
      question: "What types of peptides are used in aesthetic and wellness care?",
      answer: "Peptides used in this field generally fall into three broad groups: prescription medicines for medically supervised weight management, products that influence selected hormone-related pathways and topical skincare peptides intended to support collagen, hydration or skin renewal. These products do not have the same purpose, level of evidence, method of administration or regulatory status."
    },
    {
      question: "Can peptides support weight loss?",
      answer: "Yes. Certain prescription peptide-based medicines can support weight loss by helping regulate appetite, increasing fullness, reducing food cravings and influencing digestion or metabolic pathways. They work best as part of a medically supervised plan that also addresses nutrition, activity, sleep and long-term weight maintenance."
    },
    {
      question: "How much weight can I lose with peptide therapy?",
      answer: "The amount of weight lost depends on the exact medication, dosage, treatment duration, starting weight, health conditions, nutrition, physical activity and individual response. Results cannot be guaranteed, and the treatment should be regularly reviewed to determine whether it remains effective and appropriate."
    },
    {
      question: "Can peptides support hormonal wellness?",
      answer: "Certain peptide medicines can influence hormone release or selected hormone-related pathways. When an appropriate deficiency, symptom or medical indication is identified, treatment can support areas such as energy, recovery, sexual wellness, appetite regulation or general physical wellbeing. The exact concern should be medically assessed rather than treated using a general claim of hormone balancing."
    },
    {
      question: "Can peptides improve muscle tone or recovery?",
      answer: "Selected peptides are promoted for recovery, physical performance and body-composition support. However, the strength of evidence varies considerably between products. Peptide therapy does not replace resistance training, sufficient protein, balanced nutrition, rest or proper diagnosis and treatment of an injury."
    },
    {
      question: "What can skincare peptides do?",
      answer: "Certain topical skincare peptides can support collagen and elastin activity, improve hydration and strengthen the skin’s visible condition. With consistent use, they can help soften fine lines and support firmer, smoother and more radiant-looking skin. Results depend on the peptide formulation, concentration, skincare routine and condition of the skin."
    },
    {
      question: "Are skincare peptides injected?",
      answer: "Not necessarily. Many peptides used specifically for cosmetic skincare are applied topically through professional products, facials or a suitable homecare routine. Prescription peptides used for weight management or certain medical concerns can be administered by injection. The method depends on the exact product and its intended purpose."
    },
    {
      question: "How long does peptide therapy take to work?",
      answer: "The timeline depends on the peptide and the intended outcome. Changes in appetite can occur earlier with certain weight-management medicines, while visible weight loss develops over time. Hormone-related outcomes depend on the condition being treated and the body’s response. Skincare improvements generally require consistent use over several weeks or months."
    },
    {
      question: "What side effects can peptide injections cause?",
      answer: "Possible effects include injection-site pain, redness, itching, swelling, bruising, headache, dizziness, nausea, digestive changes, fatigue, altered appetite, fluid retention, changes in blood sugar, allergic reactions and unintended hormonal effects. The actual risks depend on the peptide, dosage, product quality, medical history and other medications."
    },
    {
      question: "Are peptide injections safe?",
      answer: "Safety depends on the identity and quality of the product, the evidence supporting its use, appropriate prescribing, sterile preparation, accurate dosing and ongoing medical monitoring. Injectable peptides should be obtained through a legitimate medical and pharmaceutical pathway. Products sold online for research use should not be injected."
    },
    {
      question: "Who can be unsuitable for peptide therapy?",
      answer: "Treatment can be unsuitable, postponed or require specialist clearance if you are pregnant or breastfeeding, under 18 or have certain cancers, uncontrolled diabetes, significant liver or kidney disease, pancreatic or gallbladder disease, an endocrine disorder, severe gastrointestinal illness, a serious cardiovascular condition or a history of severe allergic reactions. Suitability also depends on the exact peptide and your current medications."
    },
    {
      question: "Can I purchase peptides online and inject them myself?",
      answer: "This is not recommended. Products labelled for research use can have uncertain ingredients, strength, sterility and manufacturing quality. Incorrect dosing, contamination, improper storage and unsafe injection techniques can cause serious harm. Injectable peptide treatment should be prescribed and monitored by an appropriately licensed medical professional."
    }],
  },
  "body-contouring": {
    slug: "body-contouring",
    tagline: "Shape, smooth and refine targeted areas",
    overview: "Non surgical body contouring uses selected aesthetic technologies to improve the shape, firmness and visible definition of targeted areas without traditional surgery. Depending on your concerns and the treatment selected, it can reduce small areas of unwanted fat, support firmer looking skin, soften the appearance of cellulite, stimulate selected muscles or address temporary puffiness. At Melt Aways, your body is assessed before treatment to determine whether the area is mainly affected by localised fat, loose skin, reduced muscle tone, fluid retention or a combination of factors.",
    howItWorks: "Body contouring is not one standard procedure. Your personalised plan can include ultrasound cavitation for localised fat, radiofrequency for skin firmness, vacuum assisted treatment for tissue mobilisation and the appearance of cellulite, muscle stimulation for visible conditioning or lymphatic drainage for temporary fluid retention. The selected handpiece, applicator or treatment pad is positioned over the targeted area and adjusted according to your body, comfort and the intended result. Each technology works differently, so the recommended method, settings, appointment length and number of sessions will depend on what the area actually requires.",
    benefits: ["Can improve the visible shape of targeted body areas",
    "Can reduce the appearance of small pockets of resistant fat",
    "Can create a more defined waistline",
    "Can support firmer and smoother looking skin",
    "Can improve the appearance of mild skin looseness",
    "Can soften the visible texture of cellulite",
    "Can enhance existing curves and body contours",
    "Can support muscle conditioning and visible definition",
    "Can reduce the appearance of temporary puffiness when drainage is appropriate",
    "Can address more than one body concern through a personalised programme",
    "Provides a non surgical approach to contour refinement",
    "Can complement a healthy and active lifestyle"],
    idealFor: ["Small areas of localised or resistant fat",
    "Limited definition around the waist",
    "Fullness affecting the abdomen or flanks",
    "Mildly loose or less firm looking skin",
    "Visible cellulite or uneven texture",
    "Reduced muscle tone in selected areas",
    "Temporary puffiness or fluid related fullness",
    "Changes in body shape following weight loss",
    "Clients who are reasonably close to a stable weight",
    "Concerns affecting the upper or lower abdomen",
    "The waist, hips, flanks or lower back",
    "The upper back or bra line area",
    "The upper arms, thighs, buttocks or knees",
    "Clients seeking targeted improvement without traditional surgery"],
    whatToExpect: "Your appointment begins with an assessment of the area, your desired result, weight history, pregnancy history, previous procedures, lifestyle and relevant medical conditions. The practitioner will determine whether the concern is mainly related to fat, skin, muscle, fluid or natural body structure. The area can then be cleansed, photographed, measured or marked before a gel, protective layer or applicator is placed on the skin. Depending on the technology selected, you can experience warmth, cooling, suction, pressure, vibration, tingling or repeated muscle contractions. Treatment settings can be adjusted according to your comfort and response. Tell your practitioner immediately if you experience burning, sharp pain, excessive heat or severe discomfort.",
    aftercare: "Follow the instructions provided for the particular technology used during your appointment. Keep the treated area clean and maintain your normal hydration unless medically restricted. Avoid scratching, rubbing, picking or applying harsh products to sensitive skin. Excessive heat, strenuous exercise, alcohol, massage or particular skincare products can need to be temporarily avoided depending on the procedure. Wear comfortable clothing if the area feels tender and continue normal light movement unless instructed otherwise. Contact Melt Aways if you experience blistering, severe or worsening pain, excessive swelling, unusual discolouration, increasing numbness or another unexpected reaction.",
    duration: "Appointment length depends on the technology selected, the size and number of areas being treated and whether more than one suitable method is included. Your expected treatment time, preparation requirements and recovery period will be explained during your consultation.",
    sessions: "Some body contouring procedures are planned as a carefully spaced series, while others can require fewer appointments. The number and frequency of sessions depend on the selected technology, size of the area, type of concern, desired improvement, safety limitations and your response. Progress can be reviewed throughout the programme so the plan can be adjusted where appropriate. More sessions do not automatically produce a better result.",
    faqs: [{
      question: "When can I notice results?",
      answer: "Some clients can notice temporary smoothing, reduced puffiness or improved firmness shortly after a session. Changes involving localised fat reduction, muscle conditioning or collagen development generally become visible more gradually. The timeline depends on the technology, treatment area, tissue present, skin and muscle condition, general health, lifestyle and individual response."
    },
    {
      question: "Is body contouring a weight loss treatment?",
      answer: "No. Non surgical body contouring is intended to improve selected areas rather than cause major overall weight loss or treat obesity. It is generally most appropriate for clients who are reasonably close to a stable weight but have a particular area that lacks firmness, definition or proportion."
    },
    {
      question: "What body contouring treatments can be used?",
      answer: "Depending on the services available and your suitability, treatment can include ultrasound cavitation, radiofrequency, vacuum assisted therapy, muscle stimulation or lymphatic drainage. Each method addresses a different concern and should be recommended according to what is affecting the area."
    },
    {
      question: "Can different body contouring treatments be combined?",
      answer: "Yes, when each method has a clear purpose and the combination is suitable for your body. One treatment can target localised fat while another addresses skin firmness, muscle condition or temporary fluid retention. Combining several procedures without a clear reason does not guarantee a stronger result."
    },
    {
      question: "Does body contouring hurt?",
      answer: "Comfort levels vary according to the technology, treatment area and individual sensitivity. You can experience warmth, cooling, pressure, suction, vibration, tingling or strong muscle contractions. These sensations can feel unusual or intense, but treatment should not cause burning, sharp pain or severe discomfort."
    },
    {
      question: "Is there downtime?",
      answer: "Many non surgical body contouring treatments require little interruption to your normal routine. Depending on the procedure, temporary redness, swelling, tenderness, bruising, numbness, tingling, muscle soreness, skin sensitivity, firmness or small lumps beneath the skin can occur while the area settles."
    },
    {
      question: "How long can the results last?",
      answer: "The duration of improvement depends on the procedure and what happens after your programme. Results can be easier to maintain with a reasonably stable weight, regular physical activity, balanced nutrition, normal hydration and suitable maintenance care. Body contouring cannot prevent future changes caused by weight fluctuation, pregnancy, ageing, hormones or reduced skin firmness."
    },
    {
      question: "Can body contouring remove cellulite?",
      answer: "Selected treatments can soften the visible texture of cellulite and temporarily create a smoother appearance. Cellulite is influenced by connective tissue, fat distribution, skin quality, hormones and genetics, so complete or permanent removal cannot be guaranteed."
    },
    {
      question: "Can body contouring tighten loose skin?",
      answer: "Radiofrequency and certain other technologies can support collagen activity and improve the appearance of mild skin looseness. Non surgical treatments cannot reproduce the amount of tissue removal or lifting achieved through surgery, particularly when substantial excess skin is present."
    },
    {
      question: "Is non surgical body contouring safe?",
      answer: "Body contouring can be performed safely when the client is properly screened and trained practitioners use suitable equipment, settings and treatment protocols. Possible adverse effects vary by technology and can include burns, blistering, bruising, pigmentation changes, altered sensation, infection, scarring, persistent pain, muscle or nerve injury, uneven contours and an unsatisfactory cosmetic result."
    },
    {
      question: "Who can be unsuitable for body contouring?",
      answer: "Treatment can be postponed, changed or require medical clearance if you are pregnant or breastfeeding; have a pacemaker, implanted electronic device or metal near the area; or have heart, liver or kidney disease, a clotting disorder, uncontrolled diabetes, a hernia, impaired healing or reduced sensation. Active infection, open wounds, unexplained swelling, recent surgery and blood thinning medication must also be disclosed."
    },
    {
      question: "Which body contouring treatment is right for me?",
      answer: "The appropriate method depends on whether the area is affected mainly by localised fat, loose skin, reduced muscle tone, temporary fluid retention or natural body structure. Melt Aways will assess the area and recommend one suitable treatment or a structured programme based on your actual needs and realistic goals."
    }],
  },
  "iv-therapy": {
    slug: "iv-therapy",
    tagline: "Consultation-led intravenous infusions for hydration, wellness and recovery",
    overview: "IV therapy delivers a tailored blend of fluids, vitamins, minerals or amino acids directly into the bloodstream through a small cannula. Because the infusion bypasses digestion, the selected nutrients become available to the body more efficiently than many oral options. At Melt Aways, every IV appointment begins with a health review so the drip recommended reflects your current wellness, hydration, lifestyle and any relevant medical history. IV therapy is intended to support general wellbeing and recovery rather than treat, diagnose or cure medical conditions.",
    howItWorks: "During your consultation, your practitioner will discuss your goals, review your health history and confirm that IV therapy is appropriate for you. A suitable formulation is then prepared. A fine cannula is placed in a vein, usually in the arm or the back of the hand, and the infusion is delivered gradually while you rest in a comfortable treatment chair. Your vital signs, comfort and the infusion site are monitored throughout. Once the drip is complete, the cannula is removed and the site is dressed.",
    benefits: [
      "Supports hydration and fluid balance",
      "Delivers selected vitamins and minerals directly to the bloodstream",
      "May support energy levels and general wellbeing",
      "May support recovery after travel, illness or strenuous activity",
      "Can complement skin, hair and nail wellness routines",
      "May support immune function as part of a broader lifestyle",
      "Personalised formulations based on your consultation",
      "Administered in a calm, private clinical setting"
    ],
    idealFor: [
      "General wellness and hydration support",
      "Fatigue related to lifestyle, travel or busy schedules",
      "Recovery after dehydration, mild illness or long flights",
      "Support alongside fitness, training or event preparation",
      "Skin, hair and nail wellness routines",
      "Occasional immune support",
      "Clients seeking a considered, consultation-led approach to wellness"
    ],
    whatToExpect: "Your appointment begins with a short health check, including blood pressure and a review of any medication, allergies or relevant conditions. Once you are settled, the cannula is placed and the drip begins. Most infusions take between 30 and 60 minutes, during which you can relax, read or rest. You may feel a brief pinch on insertion, mild coolness along the arm as the fluid enters, or a temporary taste sensation depending on the formulation. Your practitioner will remain nearby and monitor you throughout.",
    aftercare: "Keep the small dressing in place for a few hours and avoid heavy lifting with the treated arm for the rest of the day. Continue drinking water, eat as normal and resume light activity. Mild bruising or tenderness at the cannula site may occur and usually settles quickly. Contact Melt Aways promptly if you notice increasing redness, swelling, warmth, discharge, fever or any unexpected reaction. Instructions provided by your practitioner should always take priority.",
    duration: "Most IV therapy sessions take 30 to 60 minutes, plus a short consultation and post-infusion rest. Your expected appointment length will be confirmed at booking based on the formulation selected.",
    sessions: "Some clients choose a single IV session for occasional support, while others follow a spaced schedule as part of an ongoing wellness routine. Frequency should always be based on reassessment and how you respond rather than a fixed package alone.",
    faqs: [
      { question: "Does IV therapy hurt?", answer: "You may feel a brief pinch when the cannula is inserted and a cool sensation along the arm as the fluid enters. Most clients find the experience comfortable and relaxing." },
      { question: "How quickly will I feel a difference?", answer: "Some clients notice improved hydration or a refreshed feeling soon after treatment. Other effects may be more gradual and depend on your baseline wellness, lifestyle, sleep, nutrition and the formulation selected." },
      { question: "Is IV therapy a treatment for medical conditions?", answer: "No. IV therapy at Melt Aways is intended to support general wellness, hydration and recovery. It is not a substitute for medical care, prescribed treatment or advice from your doctor." },
      { question: "Is there downtime?", answer: "Most clients return to their normal day after treatment. Mild bruising or tenderness at the cannula site may occur and usually settles quickly." },
      { question: "Who may not be suitable for IV therapy?", answer: "IV therapy may need to be postponed or medically cleared if you are pregnant or breastfeeding, have kidney, liver or heart conditions, a bleeding or clotting disorder, an active infection, allergies to any of the ingredients, or take medication that may interact with the formulation. Always disclose your full health history at consultation." }
    ],
    disclaimer: "IV therapy is a wellness service and is not intended to diagnose, treat or cure any medical condition. A consultation is required and treatment is only provided when clinically appropriate."
  },
};