/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Tabs,
  Card,
  Input,
  Button,
  Typography,
  Divider,
  Select,
  Space,
  Alert,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useCreateFamilyAgreementMutation, useGetFamilyAgreementTemplatesQuery } from "@/redux/features/aggrements/familyAggrements";
import { useGetChildQuery } from "@/redux/features/childprofiles/childprofiles";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
const { Option } = Select;

// Define types for our data structure
type Option = {
  text: string;
};

type Question = {
  questionId: string;
  questionText: string;
  options: Option[];
};

type Section = {
  sectionType: string;
  step: number;
  progress: number;
  questions: Question[];
};

// Character limits for questions and answers
const QUESTION_TEXT_LIMIT = 45; // Maximum tegn for question text
const ANSWER_TEXT_LIMIT = 30; // Maximum tegn for answer/option text

// Default family agreement template sections
const DEFAULT_SECTIONS: Section[] = [
  {
    sectionType: "Skjermtidsregler",
    step: 1,
    progress: 25,
    questions: [
      {
        questionId: "q1_screentime_weekday",
        questionText: "Hvor mye skjermtid på ukedager?",
        options: [
          { text: "30 minutter" },
          { text: "1 time" },
          { text: "2 timer" },
          { text: "1,5 timer" },
        ],
      },
      {
        questionId: "q2_screentime_weekend",
        questionText: "Hvor mye skjermtid i helgen?",
        options: [
          { text: "1 time" },
          { text: "2 timer" },
          { text: "3 timer" },
          { text: "Fleksibelt" },
        ],
      },
      {
        questionId: "q3_bedtime_rule",
        questionText: "Når skal telefonen legges vekk om kvelden?",
        options: [
          { text: "20:00" },
          { text: "21:00" },
          { text: "30 minutter før sengetid" },
          { text: "Ved sengetid" },
        ],
      },
    ],
  },
  {
    sectionType: "App- og innholdsregler",
    step: 2,
    progress: 50,
    questions: [
      {
        questionId: "q5_allowed_apps",
        questionText: "Hvilke apper er tillatt?",
        options: [
          { text: "Meldinger" },
          { text: "Telefon" },
          { text: "Læringsapper" },
          { text: "Spill (aldersvurdert)" },
          { text: "Musikk-apper" },
        ],
      },
      {
        questionId: "q6_app_download",
        questionText: "Kan apper lastes ned uten tillatelse?",
        options: [
          { text: "Alltid spør forelder først" },
          { text: "Kun læringsapper" },
          { text: "Gratis apper med tillatelse" },
        ],
      },
    ],
  },
  {
    sectionType: "Sikkerhet og kommunikasjon",
    step: 3,
    progress: 75,
    questions: [
      {
        questionId: "q8_online_safety",
        questionText: "Hva bør du gjøre hvis noen er frekk på nettet?",
        options: [
          { text: "Fortell forelder umiddelbart" },
          { text: "Blokkér og fortell forelder" },
          { text: "Ta skjermbilde og fortell forelder" },
        ],
      },
      {
        questionId: "q9_parent_checks",
        questionText: "Hvor ofte vil forelder sjekke telefonen?",
        options: [
          { text: "Daglig" },
          { text: "Ukentlig" },
          { text: "Tilfeldig" },
          { text: "Når det er bekymring" },
        ],
      },
      {
        questionId: "q10_privacy_sharing",
        questionText:
          "Hvilken personlig informasjon bør ikke deles på nettet?",
        options: [
          { text: "Fullt navn og adresse" },
          { text: "Skolenavn" },
          { text: "Personlige bilder" },
          { text: "Alt av det ovenfor" },
        ],
      },
    ],
  },
  {
    sectionType: "Aktivitet og konsekvenser",
    step: 4,
    progress: 100,
    questions: [
      {
        questionId: "q11_consequences",
        questionText: "Hva skjer hvis reglene blir brutt?",
        options: [
          { text: "Advarsel først, så tap av telefon i 1 dag" },
          { text: "Tap av telefon resten av dagen" },
          { text: "Tap av telefon i en helg" },
          { text: "Dialog med forelder først" },
        ],
      },
      {
        questionId: "q12_review_frequency",
        questionText: "Hvor ofte bør vi gjennomgå denne avtalen?",
        options: [
          { text: "Hver måned" },
          { text: "Hver 3. måned" },
          { text: "Hver 6. måned" },
          { text: "Når det trengs" },
        ],
      },
    ],
  },
];

function Page() {
  const [createFamilyAgreement] = useCreateFamilyAgreementMutation();
  const { data: childrenData } = useGetChildQuery({});
  const { data: templateData } = useGetFamilyAgreementTemplatesQuery({});
  const [activeTab, setActiveTab] = useState<string>("1");
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const router = useRouter();

  // Initialize sections with default template (will be replaced with backend data if available)
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);

  // Load family agreement templates from backend on mount
  useEffect(() => {
    if (templateData && Array.isArray(templateData) && templateData.length > 0) {
      setSections(templateData);
    }
  }, [templateData]);

  // Calculate total number of questions across all sections
  const getTotalQuestionsCount = () => {
    return sections.reduce(
      (total, section) => total + section.questions.length,
      0,
    );
  };

  // Check if each section has the required number of questions
  const hasRequiredNumberOfQuestions = () => {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      // Define the required number of questions for each section
      let requiredQuestions = 0;
      switch (section.sectionType) {
        case "Skjermtidsregler":
          requiredQuestions = 3;
          break;
        case "App- og innholdsregler":
          requiredQuestions = 2;
          break;
        case "Sikkerhet og kommunikasjon":
          requiredQuestions = 3;
          break;
        case "Aktivitet og konsekvenser":
          requiredQuestions = 2;
          break;
        default:
          requiredQuestions = 1; // Default minimum
      }

      if (section.questions.length !== requiredQuestions) {
        toast.error(
          `${section.sectionType} must have exactly ${requiredQuestions} questions.`,
        );
        return false;
      }
    }
    return true;
  };

  // Validate that all required fields are filled
  const validateForm = () => {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      for (let j = 0; j < section.questions.length; j++) {
        const question = section.questions[j];

        // Check if question text is empty
        if (!question.questionText.trim()) {
          toast.error(
            `Vennligst fyll inn spørsmålsteksten for spørsmål i ${section.sectionType}`,
          );
          return false;
        }

        for (let k = 0; k < question.options.length; k++) {
          const option = question.options[k];

          // Check if option text is empty
          if (!option.text.trim()) {
            toast.error(
              `Please fill in the option text for question in ${section.sectionType}`,
            );
            return false;
          }
        }
      }
    }
    return true;
  };

  // Add a new question to a section
  const addNewQuestion = (sectionIndex: number) => {
    const totalQuestions = getTotalQuestionsCount();

    // Check if we've reached the limit of 10 questions
    if (totalQuestions >= 10) {
        toast.warning("Maksimalt 10 spørsmål nådd for alle seksjoner.");
      return;
    }

    const newQuestion: Question = {
      questionId: `q${Date.now()}`,
      questionText: "",
      options: [{ text: "" }],
    };

    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions.push(newQuestion);
    setSections(updatedSections);
  };

  // Remove a question from a section
  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    const updatedSections = [...sections];
    if (updatedSections[sectionIndex].questions.length > 1) {
      updatedSections[sectionIndex].questions.splice(questionIndex, 1);
      setSections(updatedSections);
    }
  };

  // Handle changes to question text
  const handleQuestionTextChange = (
    sectionIndex: number,
    questionIndex: number,
    newText: string,
  ) => {
    // Enforce character limit
    if (newText.length > QUESTION_TEXT_LIMIT) {
      toast.warning(
        `Innholdsteksten overstiger ${QUESTION_TEXT_LIMIT} tegngrensen.`,
      );
      return;
    }

    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions[questionIndex].questionText =
      newText;
    setSections(updatedSections);
  };

  // Handle changes to option text
  const handleOptionTextChange = (
    sectionIndex: number,
    questionIndex: number,
    optionIndex: number,
    newText: string,
  ) => {
    // Enforce character limit
    if (newText.length > ANSWER_TEXT_LIMIT) {
      toast.warning(
        `Instillingteksten overstiger ${ANSWER_TEXT_LIMIT} tegngrensen.`,
      );
      return;
    }

    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions[questionIndex].options[
      optionIndex
    ].text = newText;
    setSections(updatedSections);
  };

  // Add a new option to a question
  const addNewOption = (sectionIndex: number, questionIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions[questionIndex].options.push({
      text: "",
    });
    setSections(updatedSections);
  };

  // Remove an option from a question
  const removeOption = (
    sectionIndex: number,
    questionIndex: number,
    optionIndex: number,
  ) => {
    const updatedSections = [...sections];
    if (
      updatedSections[sectionIndex].questions[questionIndex].options.length > 1
    ) {
      updatedSections[sectionIndex].questions[questionIndex].options.splice(
        optionIndex,
        1,
      );
      setSections(updatedSections);
    }
  };

  // Navigate to the next tab
  const goToNextTab = () => {
    const currentIndex = parseInt(activeTab);
    if (currentIndex < sections.length) {
      setActiveTab((currentIndex + 1).toString());
    }
  };

  // Navigate to the previous tab
  const goToPreviousTab = () => {
    const currentIndex = parseInt(activeTab);
    if (currentIndex > 1) {
      setActiveTab((currentIndex - 1).toString());
    }
  };

  // Format data to match the required POST request body format
  const formatData = () => {
    return {
      childProfileId: selectedChildId,
      sections,
    };
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (!selectedChildId) {
        toast.error("Vennligst velg et barn før du oppretter avtalen.");
        return;
      }

      if (!hasRequiredNumberOfQuestions()) {
        return;
      }

      // Validate all required fields are filled
      if (!validateForm()) {
        return;
      }

      const formattedData = formatData();
      const res = await createFamilyAgreement(formattedData).unwrap();
      toast.success(res.message || "Avtaler lagt til vellykket");
      router.push("/familyagreement");
    } catch (error: any) {
      toast.error(error?.data?.message || "Det oppsto en feil ved tillegg av avtale");
    }
  };

  // Prepare tab items for Ant Design Tabs
  const tabItems = sections.map((section, sectionIndex) => {
    const totalQuestions = getTotalQuestionsCount();
    const canAddMoreQuestions = totalQuestions < 10;

    return {
      key: section.step.toString(),
      label: section.sectionType,
      children: (
        <div className="p-4">
          <Title level={4}>{section.sectionType}</Title>

          {/* Show warning if the limit is reached */}
          {!canAddMoreQuestions && (
            <Alert
              message="Spørsmålgrensen nådd"
              description={`Du har nådd maksimalt 10 spørsmål på tvers av alle seksjoner. Du kan ikke legge til flere spørsmål.`}
              type="warning"
              showIcon
              className="mb-4"
            />
          )}

          {section.questions.map((question, questionIndex) => (
            <Card
              key={`${sectionIndex}-${questionIndex}`}
              className="mb-6"
              bordered={true}
            >
              <div className="mb-4">
                <Text strong>Spørsmålstekst:</Text>
                <Input
                  value={question.questionText}
                  onChange={(e) =>
                    handleQuestionTextChange(
                      sectionIndex,
                      questionIndex,
                      e.target.value,
                    )
                  }
                  className="mt-1"
                  placeholder="Skriv inn spørsmålsteksten"
                  size="large"
                  maxLength={QUESTION_TEXT_LIMIT} // Show character limit in UI
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {question.questionText.length}/{QUESTION_TEXT_LIMIT}{" "}
                  tegn
                </div>
              </div>

              <Divider>Instillinger</Divider>

              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex flex-col mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        handleOptionTextChange(
                          sectionIndex,
                          questionIndex,
                          optionIndex,
                          e.target.value,
                        )
                      }
                      placeholder="Skriv inn instillingsteksten"
                      className="flex-1"
                      size="large"
                      maxLength={ANSWER_TEXT_LIMIT} // Show character limit in UI
                    />
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() =>
                        removeOption(sectionIndex, questionIndex, optionIndex)
                      }
                      disabled={question.options.length <= 1}
                    />
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {option.text.length}/{ANSWER_TEXT_LIMIT} tegn
                  </div>
                </div>
              ))}

              <Button
                type="dashed"
                onClick={() => addNewOption(sectionIndex, questionIndex)}
                icon={<PlusOutlined />}
                className="w-full mb-3"
                size="large"
              >
                Legg til instilling
              </Button>

              <Button
                type="text"
                danger
                onClick={() => removeQuestion(sectionIndex, questionIndex)}
                disabled={section.questions.length <= 1}
                className="flex items-center ml-auto"
                size="large"
              >
                <MinusCircleOutlined /> Fjern spørsmål
              </Button>
            </Card>
          ))}

          <Button
            type="dashed"
            onClick={() => addNewQuestion(sectionIndex)}
            icon={<PlusOutlined />}
            className="w-full mt-4"
            size="large"
            disabled={!canAddMoreQuestions}
          >
            Legg til nytt spørsmål
          </Button>
        </div>
      ),
    };
  });

  return (
    <div className="max-w-full mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Opprett familieavtale</Title>
        <Space>
          <Text>Velg barn:</Text>
          <Select
            placeholder="Velg et barn"
            style={{ width: 200 }}
            value={selectedChildId}
            onChange={(value) => setSelectedChildId(value)}
          >
            {childrenData?.data?.map((child: any) => (
              <Option key={child.id} value={child.id}>
                {child.fullName}
              </Option>
            ))}
          </Select>
        </Space>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        destroyInactiveTabPane={true}
      />

      <div className="flex justify-between mt-6">
        <Button
          type="default"
          size="large"
          onClick={goToPreviousTab}
          disabled={parseInt(activeTab) === 1}
        >
          Forrige
        </Button>

        {parseInt(activeTab) < sections.length ? (
          <Button
            type="primary"
            size="large"
            onClick={goToNextTab}
            disabled={!hasRequiredNumberOfQuestions()}
          >
            Neste
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!selectedChildId || !hasRequiredNumberOfQuestions()}
          >
            Opprett avtale
          </Button>
        )}
      </div>
    </div>
  );
}

export default Page;

