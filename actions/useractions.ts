"use server"

import { prisma } from "@/prisma/prisma"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const updateUser = async (data:any) => {
    data["jobTenure"] = parseInt(data["jobTenure"]);
    const d = await prisma.userdata.findFirst();
    await prisma.userdata.update({
        where:{
            id:d?.id
        },
        data
    });

    revalidatePath("");
}


export const getTodayDate = async() => {
    const date = new Date();
    date.setHours(0,0,0,0);
    return date;
}


export const markHoliday = async() => {

    const d = await getTodayDate();
    await prisma.dailydata.update({
        where:{
            date: d
        },
        data:{
            workingDay : false
        }
    })


    revalidatePath("")
}

export const markWorkingDay = async() => {

    const d = await getTodayDate();
    await prisma.dailydata.update({
        where:{
            date: d
        },
        data:{
            workingDay : true
        }
    })

    revalidatePath("")

}


export const markCheckIn = async () => {
    const officeStartTime = new Date();
    officeStartTime.setHours(9, 30, 0, 0); // Set to 9:30 AM

    const currentTime = new Date();
    const lateDuration = Math.max(0, Math.floor((currentTime - officeStartTime) / (1000 * 60))); // Calculate difference in minutes

    const d = await getTodayDate();
    await prisma.dailydata.update({
        where: {
            date: d
        },
        data: {
            inTime: currentTime,
            lateDuration
        }
    });

    revalidatePath("");
};



export const markCheckout = async () => {
    const officeEndTime = new Date();
    officeEndTime.setHours(16, 30, 0, 0); // Set to 4:30 PM

    const currentTime = new Date();
    const overTimeDuration = Math.max(0, Math.floor((currentTime - officeEndTime) / (1000 * 60))); // Calculate difference in minutes

    const d = await getTodayDate();
    await prisma.dailydata.update({
        where: {
            date: d
        },
        data: {
            outTime: currentTime,
            overTimeDuration
        }
    });

    revalidatePath("");
};



export const recordBreak = async(i: number) => {

    const d = await getTodayDate();
    await prisma.dailydata.update({
        where:{
            date: d
        },
        data:{
            BreakDuration : i
        }
    })

    revalidatePath("")

}