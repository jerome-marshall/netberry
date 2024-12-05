import Card from "@/components/Card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/react-select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/utils/api";
import { createFormSchema } from "@/utils/schemas";
import { cn, convertStringToEnvKeyValue } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import Link from "next/link";
import type { FC } from "react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { Id } from "react-toastify";
import { toast } from "react-toastify";
import useAccounts from "src/hooks/useAccounts";
import useAddEnv from "src/hooks/useAddEnv";
import type { AccountNoToken, NetlifyHook, Site } from "src/types";
import type { z } from "zod";
import Modal from "./Modal";
import { CopyButtonSm } from "./ui/copy-button";

interface CreateSiteCardProps {}

type SiteResult = {
  site: Site;
  account: AccountNoToken;
  hook: NetlifyHook;
  domain: string;
  templateRepo: string;
  repoName: string;
};

const CreateSiteCard: FC<CreateSiteCardProps> = ({}) => {
  const toastIdRepo = useRef<Id | null>(null);
  const toastIdSite = useRef<Id | null>(null);
  const toastIdEnv = useRef<Id | null>(null);

  const [siteResult, setSiteResult] = useState<SiteResult | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [isLoading, setIsLoading] = useState(false);

  const { data } = api.admin.getRepoTemplates.useQuery();

  const { accountsOptions } = useAccounts();

  const repoOptions = useMemo(
    () =>
      data?.map((repo) => ({
        label: repo.name,
        value: repo.name,
      })),
    [data]
  );

  const branchOptions = [
    { label: "Live", value: "live" },
    { label: "Master", value: "master" },
  ];

  const defaultValues = {
    domain: "",
    // envString: `GATSBY_ALGOLIA_API_KEY=a8006e76487b9c94fd077818a6710cff\nGATSBY_ALGOLIA_APP_ID=BJ44CQI5UI\nGATSBY_ALGOLIA_INDEX_NAME=dev_properties\nGATSBY_CLOUD_URL=https://sirius-dev.q.starberry.com\nGATSBY_DEFAULT_AREA=London\nGATSBY_MAP_PROVIDER=leaflet\nGATSBY_PROPERTY_INCLUDE_SOLD=true\nGATSBY_RECAPTCHA_KEY=6LfGGkMkAAAAAHVOXyPOYDYBA0ohGttPKFZDIrnm\nGATSBY_SITE_NAME=Sirius Estate Agents - Dev Site\nGATSBY_SITE_URL=https://sirius-dev.q.starberry.com\nGATSBY_STRAPI_API_TOKEN=a61ad819b7a9f34c01e9bb785a2c8905f755449cc9a27482ce9ecc999c58505ee00c1131a68ee5a2a3fee6559b735912be01935a850833c6e14129475fde0dcde689027d21019b46eeb877e90e934d83c94a23935cd8e1c4e4eee9c079f40f2d05b3b5fa038a4840d5eb32710331b3f79894d8b255874a027f9b23530944e071\nGATSBY_STRAPI_FORM_TOKEN=a61ad819b7a9f34c01e9bb785a2c8905f755449cc9a27482ce9ecc999c58505ee00c1131a68ee5a2a3fee6559b735912be01935a850833c6e14129475fde0dcde689027d21019b46eeb877e90e934d83c94a23935cd8e1c4e4eee9c079f40f2d05b3b5fa038a4840d5eb32710331b3f79894d8b255874a027f9b23530944e071\nGATSBY_STRAPI_GGFX_ENV=i.dev\nGATSBY_STRAPI_SRC=https://strapi-themes-dev.q.starberry.com\nMAILGUN_API_KEY=key-0bsaaqb784u9td5fm0wrbwaegu4y3um6\nMAILGUN_API_URL=https://api.mailgun.net/v3/mg.starberry.com\nMAILGUN_DOMAIN=mg.starberry.com\nMAIL_BCC=sirius-allemails@starberry.tv\nMAIL_FROM=Sirius <no-reply@sirius.co.uk>\nMAIL_TO=email@starberry.tv\nMAIL_VIEWING_CC=email@starberry.tv\nMAIL_VIEWING_TO=email@starberry.tv\nNODE_VERSION=18\nNPM_TOKEN=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\nSUBSCRIPTION_MAIL_TO=email@starberry.tv`,
    envString: "",
    netlifyAccount: "dev",
    repoName: "",
    siteName: "",
    templateRepo: "gatsby-theme-starberry-sirius",
    repoBranch: "master",
  };

  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues,
  });

  const {
    addEnvMutation: { mutate: addEnvs },
  } = useAddEnv({
    cbOnMutate() {
      setIsLoading(true);
    },
    cbOnSettled() {
      setIsLoading(false);
      form.reset(defaultValues);
    },
  });

  const { mutate: createNetlifySite } = api.admin.createNetlifySite.useMutation(
    {
      onMutate() {
        setIsLoading(true);
        const id = toast.loading("Creating Netlify Site...");
        toastIdSite.current = id;
      },
      onSuccess(data) {
        toastIdSite.current &&
          toast.update(toastIdSite.current, {
            render: "Site created successfully",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

        if (data) {
          setSiteResult(data);
          openModal();
        }

        if (!isEmpty(data?.env)) {
          const { site, netlifyAccount, env } = data!;

          addEnvs({
            account_slug: netlifyAccount,
            netlify_account_id: site.account_id,
            site_id: site.id,
            envs: env!,
          });
        } else {
          setIsLoading(false);
          form.reset(defaultValues);
        }
      },
      onError(data) {
        const { message } = data;
        toastIdSite.current &&
          toast.update(toastIdSite.current, {
            render: (
              <div>
                <p className="text-sm">Failed to create Netlify Site</p>
                {message && <p className="text-xs">{message}</p>}
              </div>
            ),
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
        setIsLoading(false);
        form.reset(defaultValues);
      },

      onSettled() {
        toastIdSite.current = null;
      },
    }
  );

  const { mutate: createRepo } = api.admin.createRepo.useMutation({
    onMutate() {
      setIsLoading(true);
      const id = toast.loading("Creating GitHub Repository...");
      toastIdRepo.current = id;
    },
    onSuccess(data) {
      toastIdRepo.current &&
        toast.update(toastIdRepo.current, {
          render: "Repository created successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

      setIsLoading(false);
      if (data) {
        const { input } = data;
        createNetlifySite({
          ...input,
        });
      }
    },
    onError({ message }) {
      toastIdRepo.current &&
        toast.update(toastIdRepo.current, {
          render: (
            <div>
              <p className="text-sm">Failed to create GitHub Repository</p>
              {message && <p className="text-xs">{message}</p>}
            </div>
          ),
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      setIsLoading(false);
      // form.reset(defaultValues);
    },

    onSettled() {
      toastIdRepo.current = null;
    },
  });

  function onSubmit(values: z.infer<typeof createFormSchema>) {
    if (values.envString) {
      values.env = convertStringToEnvKeyValue(values.envString);
    }
    createRepo(values);
  }

  const siteURL = siteResult?.site?.ssl_url || siteResult?.site?.url;

  return (
    <Card title="Create New Site" className=" w-fit">
      <Modal
        title={"✅ Site created successfully!"}
        content={
          <div className="site-info-modal pt-2">
            <div className="modal-content-wrap">
              {siteResult?.site?.name && (
                <div className="info-item">
                  <p className="info-label">Netlify Site Name:</p>
                  <p className="site-info-value">
                    <span>{siteResult?.site?.name}</span>
                    <CopyButtonSm value={siteResult?.site?.name} />
                  </p>
                </div>
              )}

              <div className="info-item">
                {" "}
                <p className="info-label">Netlify Account:</p>
                <p className="site-info-value">
                  <span>{siteResult?.account?.name}</span>
                </p>
              </div>
              <div className="info-item">
                <p className="info-label">Domain:</p>
                <p className="site-info-value">
                  {siteURL ? (
                    <Link
                      href={siteURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {siteResult?.domain}
                    </Link>
                  ) : (
                    <span>{siteResult?.domain}</span>
                  )}
                  {siteURL && <CopyButtonSm value={siteURL} />}
                </p>
              </div>
              {siteResult?.hook?.url && (
                <div className="info-item">
                  <p className="info-label">Build Hook:</p>
                  <p className="site-info-value">
                    <span>{siteResult?.hook?.url}</span>
                    <CopyButtonSm value={siteResult?.hook?.url} />
                  </p>
                </div>
              )}
              <div className="info-item">
                <p className="info-label">Repository:</p>
                <p className="site-info-value">
                  {siteResult?.site?.build_settings?.repo_url ? (
                    <Link
                      href={siteResult?.site?.build_settings?.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {siteResult?.site?.build_settings?.repo_path}
                    </Link>
                  ) : (
                    <span>{siteResult?.repoName}</span>
                  )}
                </p>
              </div>
              <div className="info-item">
                <p className="info-label">Template Repo:</p>
                <p className="site-info-value">
                  <span>{siteResult?.templateRepo}</span>
                </p>
              </div>
            </div>
          </div>
        }
        isOpen={isOpen}
        onClose={closeModal}
      />
      <Form {...form}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center px-card_pad"
        >
          {/* <pre>
            <code>{JSON.stringify(form.watch(), null, 2)}</code>
          </pre> */}
          <div className="site-create-section  grid grid-cols-[4fr,5fr] gap-x-16">
            <div className="left-section grid gap-4">
              <FormField
                control={form.control}
                name="templateRepo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Repository</FormLabel>
                    <Select
                      options={repoOptions}
                      placeholder="Select Repository"
                      value={repoOptions?.find(
                        (item) => item.value === field.value
                      )}
                      onChange={(option) => {
                        if (option?.value) field.onChange(option.value);
                      }}
                      isDisabled={isLoading}
                    />
                    <FormDescription>
                      This is the template repo that will be used to create your
                      site.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="repoName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repository Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="gatsby-template-starter"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be the name of the repository.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repoBranch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <Select
                        className="min-w-[100px]"
                        options={branchOptions}
                        placeholder="Branch"
                        value={branchOptions?.find(
                          (item) => item.value === field.value
                        )}
                        onChange={(option) => {
                          if (option?.value) field.onChange(option.value);
                        }}
                        isDisabled={isLoading}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="netlifyAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Netlify Account</FormLabel>
                    <Select
                      options={accountsOptions}
                      placeholder="Select Account"
                      value={accountsOptions?.find(
                        (item) => item.value === field.value
                      )}
                      onChange={(option) => {
                        if (option?.value) field.onChange(option.value);
                      }}
                      isDisabled={isLoading}
                    />
                    <FormDescription>
                      This is the Netlify account in which the site will be
                      created.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Gatsby Starter"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be the name of the site in Netlify.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="gatsby-starter.netlify.app"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be the domain of the site.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="right-section">
              <FormField
                control={form.control}
                name="envString"
                render={({ field }) => (
                  <FormItem className="h-full pb-8">
                    <FormLabel>Environment Variables</FormLabel>
                    <FormControl>
                      <Textarea
                        // rows={15}
                        className=" h-full min-h-[160px]"
                        placeholder="EXAMPLE_KEY_1=EXAMPLE_VALUE_1"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <button
            type="submit"
            className={cn("button button-teal mt-8", isLoading && "loading")}
          >
            <span>Create Site</span>
          </button>
        </form>
      </Form>
    </Card>
  );
};

export default CreateSiteCard;
