
import ContributeForm from "@/components/contribute-form"
import { getTranslations } from "next-intl/server"

export default async function Page() {
  // Fetch translations using next-intl/server for the 'contribute' namespace
  const t = await getTranslations("contribute")

  // Pass the raw translation function or serialized dictionary object down
  // Since your contribute-form expects a dictionary object, you can pass an object mapped via t()
  const dict = {
    contribute: {
      title: t("title"),
      description: t("description"),
      cardTitle: t("cardTitle"),
      cardDesc: t("cardDesc"),
      productName: t("productName"),
      productNamePlaceholder: t("productNamePlaceholder"),
      productNameError: t("productNameError"),
      barcode: t("barcode"),
      barcodePlaceholder: t("barcodePlaceholder"),
      brand: t("brand"),
      brandPlaceholder: t("brandPlaceholder"),
      brandRequired: t("brandRequired"),
      brandNotListed: t("brandNotListed"),
      addBrand: t("addBrand"),
      manufacturer: t("manufacturer"),
      manufacturerPlaceholder: t("manufacturerPlaceholder"),
      manufacturerRequired: t("manufacturerRequired"),
      manufacturerNotListed: t("manufacturerNotListed"),
      addManufacturer: t("addManufacturer"),
      bakeryOrigin: t("bakeryOrigin"),
      bakeryOriginPlaceholder: t("bakeryOriginPlaceholder"),
      bakeryOriginRequired: t("bakeryOriginRequired"),
      sourceNotListed: t("sourceNotListed"),
      addSource: t("addSource"),
      sweetnessLevel: t("sweetnessLevel"),
      sweetnessPlaceholder: t("sweetnessPlaceholder"),
      richnessDri: t("richnessDri"),
      richnessPlaceholder: t("richnessPlaceholder"),
      productImage: t("productImage"),
      productImageDesc: t("productImageDesc"),
      submitProduct: t("submitProduct"),
      submitting: t("submitting"),
      submitSuccess: t("submitSuccess"),
      submitSuccessDesc: t("submitSuccessDesc"),
      submitFailed: t("submitFailed"),
      cancel: t("cancel"),
      loading: t("loading"),
      productionSiteLocation: t("productionSiteLocation"),
      clickMapToPin: t("clickMapToPin"),
      mapInstruction: t("mapInstruction"),
    }
  }

  return <ContributeForm dict={dict} />
}