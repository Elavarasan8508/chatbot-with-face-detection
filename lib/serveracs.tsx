"use server"

import { prisma } from "@/prisma/prisma";
import { startOfDay, endOfDay } from 'date-fns';

export const insertMentalHealth = async (data:any) => {

    const req = await prisma.mentalHealthAssessment.create({
        data:data
    });

    return req;
}

export const getMentalDatas = async () => {
    const data = await prisma.mentalHealthAssessment.findMany();

    // console.log(data)

    return data;
}



export const getTodayCompleted = async () => {
    const now = new Date();
    const data = await prisma.mentalHealthAssessment.count({
        where: {
            createdAt: {
                gte: startOfDay(now),
                lte: endOfDay(now),
            },
        },
    });

    return data > 0;
};

// ----------------------------------------------------------------

function summarizeData(dataArray) {
    const result = {
      id: null,
      sadness: null,
      euphoric: null,
      exhausted: null,
      sleep_disorder: null,
      mood_swing: null,
      suicidal_thoughts: null,
      anorexia: null,
      authority_respect: null,
      try_explanation: null,
      aggressive_response: null,
      ignore_and_move_on: null,
      nervous_breakdown: null,
      admit_mistakes: null,
      overthinking: null,
      concentration: null,
      optimism: null,
      createdAt: null,
      updatedAt: null,
    };
  
    // Boolean keys
    const booleanKeys = [
      "sadness",
      "euphoric",
      "exhausted",
      "sleep_disorder",
      "mood_swing",
      "suicidal_thoughts",
      "anorexia",
      "authority_respect",
      "try_explanation",
      "aggressive_response",
      "ignore_and_move_on",
      "nervous_breakdown",
      "admit_mistakes",
      "overthinking",
    ];
  
    // Map boolean keys to summary values
    const summaryMapping = {
      0: "Seldom",
      1: "Sometimes",
      2: "Usually",
      3: "Most-Often",
    };
  
    // Calculate averages for numeric keys
    const numericKeys = ["concentration", "optimism"];
  
    numericKeys.forEach((key) => {
      result[key] =
        dataArray.reduce((sum, entry) => sum + entry[key], 0) / dataArray.length;
    });
  
    // Determine the majority for boolean fields
    booleanKeys.forEach((key) => {
      const trueCount = dataArray.filter((entry) => entry[key]).length;
      const frequency = trueCount / dataArray.length;
  
      if (key === "sadness" || key === "euphoric" || key ==="exhausted" || key === "sleep_disorder") {
        result[key] =
          summaryMapping[
            Math.min(3, Math.round(frequency * (Object.keys(summaryMapping).length - 1)))
          ];
      } else {
        result[key] = frequency > 0.5;
      }
    });
  
    // Use the latest createdAt and updatedAt timestamps
    const latestEntry = dataArray.reduce((latest, entry) =>
      new Date(entry.createdAt) > new Date(latest.createdAt) ? entry : latest
    );
  
    result.createdAt = latestEntry.createdAt;
    result.updatedAt = latestEntry.updatedAt;
  
    return result;
  }
  
  // Example usage
  const data = [
    {
      id: 1,
      sadness: true,
      euphoric: false,
      exhausted: true,
      sleep_disorder: false,
      mood_swing: true,
      suicidal_thoughts: false,
      anorexia: false,
      authority_respect: false,
      try_explanation: true,
      aggressive_response: false,
      ignore_and_move_on: true,
      nervous_breakdown: false,
      admit_mistakes: true,
      overthinking: true,
      concentration: 9,
      optimism: 5,
      createdAt: "2024-12-26T17:57:00.044Z",
      updatedAt: "2024-12-26T17:57:00.044Z",
    },
    {
      id: 2,
      sadness: true,
      euphoric: false,
      exhausted: true,
      sleep_disorder: false,
      mood_swing: false,
      suicidal_thoughts: true,
      anorexia: false,
      authority_respect: true,
      try_explanation: false,
      aggressive_response: true,
      ignore_and_move_on: false,
      nervous_breakdown: true,
      admit_mistakes: false,
      overthinking: false,
      concentration: 8,
      optimism: 5,
      createdAt: "2024-12-27T03:34:07.499Z",
      updatedAt: "2024-12-27T03:34:07.499Z",
    },
  ];
  
 
  


export const processData = async () => {
    const d = await getMentalDatas();

    var summarizedData = (summarizeData(d));

    const concentration = Math.round(summarizedData.concentration);
    const optimism = Math.round(summarizedData.optimism);

    summarizedData.concentration = `${concentration} From 10`;
    summarizedData.optimism = `${optimism} From 10`;


    console.log(summarizedData);

    const req = await fetch("http://127.0.0.1:5000/predict",{
        method:'post',
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify(summarizedData)
    })

    const json = await req.json();

    // console.log(json)

    return json;



}

