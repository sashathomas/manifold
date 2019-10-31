module Packaging
  module EpubV3
    # Module that can be used to inject dependencies from {Packaging::EpubV3::Container}
    Import = Dry::AutoInject(Packaging::EpubV3::Container)

    # Shared module that defines transactional pipelines that depend
    # on {Packaging::EpubV3::Container our service container}
    # and {Packaging::Shared::StepAdapters our custom step adapters}.
    PipelinedTransaction = Dry::Transaction(
      container: Packaging::EpubV3::Container,
      step_adapters: Packaging::Shared::StepAdapters
    )
  end
end
